import React, { useCallback } from 'react';
import { useApp } from '@/app/providers';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardPresenter } from './presenters/DashboardPresenter';

export const DashboardPage: React.FC = () => {
    const { selectedBranch } = useApp();
    const { data, isLoading, error, refetch } = useDashboard(selectedBranch);
    const handleRetry = useCallback(() => {
        void refetch();
    }, [refetch]);

    return (
        <DashboardPresenter
            data={data}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
        />
    );
};
