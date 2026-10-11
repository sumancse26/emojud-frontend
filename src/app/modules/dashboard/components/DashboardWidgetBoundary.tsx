import React from 'react';
import { Skeleton } from '@/shared/components/Skeleton';

interface DashboardWidgetBoundaryProps {
    children: React.ReactNode;
    className?: string;
}

interface DashboardWidgetBoundaryState {
    hasError: boolean;
}

/** Prevents one dashboard widget error from taking down the dashboard. */
export class DashboardWidgetBoundary extends React.Component<
    DashboardWidgetBoundaryProps,
    DashboardWidgetBoundaryState
> {
    state: DashboardWidgetBoundaryState = { hasError: false };

    static getDerivedStateFromError(): DashboardWidgetBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error): void {
        console.error('Dashboard widget failed to render:', error);
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            return (
                <div className={`min-h-32 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900/50 dark:bg-amber-950/20 ${this.props.className ?? ''}`}>
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                        This dashboard section is unavailable
                    </p>
                    <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-400/80">
                        Other dashboard sections are still available.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export const DashboardWidgetSkeleton: React.FC = () => (
    <Skeleton className="min-h-32 w-full rounded-2xl" />
);

export default DashboardWidgetBoundary;
