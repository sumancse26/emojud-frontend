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
        onSuccess,
        onError,
        onSettled,
        transformError = extractApiErrorMessage
    } = options;

    const [data, setData] = useState<TData | null>(() => {
        if (typeof initialData === 'function') {
            return (initialData as () => TData | null)();
        }
        return initialData;
    });

    const [status, setStatus] = useState<ApiStatus>(immediate ? 'loading' : 'idle');
    const [error, setErrorState] = useState<string | null>(null);

    const isMountedRef = useRef<boolean>(true);
    const apiFnRef = useRef(apiFn);
    const optionsRef = useRef(options);

    apiFnRef.current = apiFn;
    optionsRef.current = options;

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

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
        if (immediate) {
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
