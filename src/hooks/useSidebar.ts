import { useMemo } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { sidebarService } from '@/services/sidebarService';
import { tokenStorage } from '@/shared/services/tokenStorage';
import type { NavMenuItem, NavMenuResponse } from '@/app/routes/types';
import type { User } from '@/app/modules/auth/types/auth.types';

export interface UseSidebarReturn {
    menuData: NavMenuItem[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => Promise<NavMenuResponse>;
}

/**
 * Domain-specific Sidebar hook built on top of the master `useApi` pattern.
 * Reads user_id and role_id from the authenticated user stored in tokenStorage,
 * then fetches the nav-menu from /api/auth/nav-menu/{userId}/{roleId}.
 */
export function useSidebar(): UseSidebarReturn {
    const user = tokenStorage.getUser<User>();
    const userId = user?.id ?? '';
    const roleId = user?.role ?? '';

    // Build stable params so `useApi` immediate mode triggers once
    const params = useMemo(
        () => ({ userId, roleId }),
        [userId, roleId]
    );

    const hasAuth = !!userId && !!roleId;

    const { data, isLoading, isError, error, execute } = useApi(
        sidebarService.getNavMenu,
        {
            immediate: hasAuth,
            initialParams: params
        }
    );

    const menuData = useMemo(() => {
        return data?.data ?? [];
    }, [data]);

    const refetch = () => execute(params);

    return {
        menuData,
        isLoading,
        isError,
        error,
        refetch
    };
}

export default useSidebar;

