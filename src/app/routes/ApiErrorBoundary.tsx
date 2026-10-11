import React from 'react';

interface ApiErrorBoundaryState {
    error: Error | null;
    retryKey: number;
}

/** Converts rejected Suspense API promises into a recoverable app state. */
export class ApiErrorBoundary extends React.Component<
    React.PropsWithChildren,
    ApiErrorBoundaryState
> {
    state: ApiErrorBoundaryState = { error: null, retryKey: 0 };

    static getDerivedStateFromError(error: Error): ApiErrorBoundaryState {
        return { error, retryKey: 0 };
    }

    handleRetry = (): void => {
        this.setState((state) => ({ error: null, retryKey: state.retryKey + 1 }));
    };

    render(): React.ReactNode {
        if (!this.state.error) {
            return <React.Fragment key={this.state.retryKey}>{this.props.children}</React.Fragment>;
        }

        return (
            <div className="flex min-h-[60vh] items-center justify-center p-6">
                <div className="max-w-md rounded-xl border border-rose-200 bg-white p-6 text-center shadow-sm dark:border-rose-900/50 dark:bg-slate-900">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Unable to load this page
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {this.state.error.message || 'The server request failed. Please try again.'}
                    </p>
                    <button
                        type="button"
                        onClick={this.handleRetry}
                        className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }
}

export default ApiErrorBoundary;
