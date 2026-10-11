import { useState, useCallback, useRef, useEffect } from 'react';

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseApiOptions<TData, TParams> {
    /** Whether to execute immediately on mount */
    immediate?: boolean;
    /** Initial parameters if executed immediately */
    initialParams?: TParams;
    /** Default initial data or lazy initializer function */
    initialData?: TData | null | (() => TData | null);
    /** Callback on successful response */
    onSuccess?: (data: TData) => void;
    /** Callback on error */
    onError?: (error: string) => void;
    /** Callback when execution completes regardless of outcome */
    onSettled?: () => void;
    /** Custom error message extractor */
    transformError?: (error: unknown) => string;
    /** Suspend the component while an immediate request is pending. */
    suspense?: boolean;
}

export interface UseApiReturn<TData, TParams> {
    data: TData | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    status: ApiStatus;
    execute: (params?: TParams) => Promise<TData>;
    reset: () => void;
    setData: React.Dispatch<React.SetStateAction<TData | null>>;
    setError: (error: string | null) => void;
}

type SuspenseResource<TData> = {
    key: string;
    status: 'pending' | 'success' | 'error';
    promise: Promise<TData>;
    data?: TData;
    error?: unknown;
    errorMessage?: string;
};

// Suspended renders can be retried before their component refs are committed.
// Keep resources outside the component so retries reuse the same request.
const suspenseResources = new Map<string, SuspenseResource<unknown>>();

function getSuspenseResourceKey<TParams>(apiFn: (params: TParams) => unknown, params: TParams): string {
    return `${apiFn.toString()}::${JSON.stringify(params)}`;
}

/**
 * Extracts a user-friendly error message from any error or axios response
 */
export function extractApiErrorMessage(error: unknown): string {
    if (!error) return 'An unexpected error occurred.';
    if (typeof error === 'string') return error;

    if (typeof error === 'object' && error !== null) {
        const err = error as Record<string, unknown>;

        // Axios-style error structure: error.response.data.message
        if (typeof err.response === 'object' && err.response !== null) {
            const res = err.response as Record<string, unknown>;
            if (typeof res.data === 'object' && res.data !== null) {
                const resData = res.data as Record<string, unknown>;
                // Handle validation errors array or string (e.g. Zod validation failure)
                if (resData.errors) {
                    try {
                        const parsed = typeof resData.errors === 'string' ? JSON.parse(resData.errors) : resData.errors;
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            const details = parsed
                                .map((item: Record<string, unknown>) => {
                                    const path = Array.isArray(item.path) ? item.path.join('.') : '';
                                    const msg = typeof item.message === 'string' ? item.message : 'Invalid value';
                                    return path ? `${path}: ${msg}` : msg;
                                })
                                .join('; ');
                            if (details) return details;
                        }
                    } catch {
                        if (typeof resData.errors === 'string' && resData.errors.trim()) {
                            return resData.errors;
                        }
                    }
                }

                if (typeof resData.message === 'string' && resData.message.trim()) {
                    return resData.message;
                }
                if (typeof resData.error === 'string' && resData.error.trim()) {
                    return resData.error;
                }
            }
        }

        // Standard Error instance message
        if (typeof err.message === 'string' && err.message.trim()) {
            return err.message;
        }
    }

    return 'Network request failed. Please check your connection.';
}

/**
 * Master Global Custom Hook for executing API requests.
 */
export function useApi<TData, TParams = void>(
    apiFn: (params: TParams) => Promise<TData>,
    options: UseApiOptions<TData, TParams> = {}
): UseApiReturn<TData, TParams> {
    const {
        immediate = false,
        initialParams,
        initialData = null,
        suspense = immediate
    } = options;

    const suspenseKey = getSuspenseResourceKey(apiFn, initialParams as TParams);
    const cachedSuspenseResource = suspenseResources.get(suspenseKey) as
        | SuspenseResource<TData>
        | undefined;

    const [data, setData] = useState<TData | null>(() => {
        if (cachedSuspenseResource?.status === 'success' && cachedSuspenseResource.data !== undefined) {
            return cachedSuspenseResource.data;
        }
        if (typeof initialData === 'function') {
            return (initialData as () => TData | null)();
        }
        return initialData;
    });

    const [status, setStatus] = useState<ApiStatus>(() => {
        if (cachedSuspenseResource?.status === 'success') return 'success';
        if (cachedSuspenseResource?.status === 'error') return 'error';
        return immediate ? 'loading' : 'idle';
    });
    const [error, setErrorState] = useState<string | null>(cachedSuspenseResource?.errorMessage ?? null);

    const isMountedRef = useRef<boolean>(true);
    const apiFnRef = useRef(apiFn);
    const optionsRef = useRef(options);

    apiFnRef.current = apiFn;
    optionsRef.current = options;

    // React 19 Suspense integration for initial data reads. The promise is
    // created during render, so Suspense can show its fallback immediately;
    // imperative execute() remains available for mutations and refetches.
    let suspenseResource = cachedSuspenseResource;
    if (suspense && immediate && !suspenseResource) {
        const resource: SuspenseResource<TData> = {
            key: suspenseKey,
            status: 'pending',
            promise: Promise.resolve(undefined as TData)
        };

        resource.promise = apiFnRef.current(initialParams as TParams).then(
            (result) => {
                resource.status = 'success';
                resource.data = result;
                if (isMountedRef.current) {
                    setData(result);
                    setStatus('success');
                    optionsRef.current.onSuccess?.(result);
                    optionsRef.current.onSettled?.();
                }
                return result;
            },
            (requestError: unknown) => {
                resource.status = 'error';
                resource.error = requestError;
                const message = optionsRef.current.transformError
                    ? optionsRef.current.transformError(requestError)
                    : extractApiErrorMessage(requestError);
                resource.errorMessage = message;
                if (isMountedRef.current) {
                    setErrorState(message);
                    setStatus('error');
                    optionsRef.current.onError?.(message);
                    optionsRef.current.onSettled?.();
                }
                // Resolve the Suspense resource after recording the failure.
                // This lets sibling API requests continue and lets the page
                // render its partial data through the normal error state.
                return undefined as TData;
            }
        );
        suspenseResources.set(suspenseKey, resource as SuspenseResource<unknown>);
        suspenseResource = resource;
    }

    if (suspense && immediate && suspenseResource) {
        if (suspenseResource.status === 'pending') throw suspenseResource.promise;
    }

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!suspense || !immediate || !suspenseResource) return;

        return () => {
            if (suspenseResources.get(suspenseKey) === suspenseResource) {
                suspenseResources.delete(suspenseKey);
            }
        };
    }, [immediate, suspense, suspenseKey, suspenseResource]);

    const execute = useCallback(
        async (params?: TParams): Promise<TData> => {
            if (isMountedRef.current) {
                setStatus('loading');
                setErrorState(null);
            }

            try {
                const result = await apiFnRef.current(params as TParams);

                if (isMountedRef.current) {
                    setData(result);
                    setStatus('success');
                    optionsRef.current.onSuccess?.(result);
                }
                return result;
            } catch (err: unknown) {
                const message = optionsRef.current.transformError
                    ? optionsRef.current.transformError(err)
                    : extractApiErrorMessage(err);

                if (isMountedRef.current) {
                    setErrorState(message);
                    setStatus('error');
                    optionsRef.current.onError?.(message);
                }
                throw err;
            } finally {
                if (isMountedRef.current) {
                    optionsRef.current.onSettled?.();
                }
            }
        },
        []
    );

    const reset = useCallback(() => {
        if (isMountedRef.current) {
            const initial = typeof initialData === 'function'
                ? (initialData as () => TData | null)()
                : initialData;
            setData(initial);
            setErrorState(null);
            setStatus('idle');
        }
    }, [initialData]);

    const setError = useCallback((newError: string | null) => {
        if (isMountedRef.current) {
            setErrorState(newError);
            if (newError) setStatus('error');
        }
    }, []);

    const prevParamsRef = useRef<unknown>(Symbol());

    useEffect(() => {
        if (immediate && !suspense) {
            const serialized = JSON.stringify(initialParams);
            if (prevParamsRef.current !== serialized) {
                prevParamsRef.current = serialized;
                execute(initialParams).catch(() => {
                    // Handled in execute catch block
                });
            }
        }
    }, [immediate, execute, initialParams]);

    return {
        data,
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
        error,
        status,
        execute,
        reset,
        setData,
        setError
    };
}

export default useApi;
