import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { sidebarService, type NavMenuParams } from '@/services/sidebarService';
import { tokenStorage } from '@/shared/services/tokenStorage';
import { NAV_MENU_DATA } from '@/config/nav-menu.data';
import type { NavMenuItem, NavMenuResponse } from '@/app/routes/types';
import type { User } from '@/app/modules/auth/types/auth.types';

export interface UseSidebarReturn {
    menuData: NavMenuItem[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => Promise<NavMenuResponse>;
}

const ROLE_NAME_TO_ID: Record<string, string> = {
    'super administrator': '1',
    'super admin': '1',
    'superadmin': '1',
    'administrator': '2',
    'admin': '2',
    'manager': '3',
    'staff': '4',
    'operator': '5'
};

/**
 * Robustly resolve numeric userId and roleId from tokenStorage or JWT claims.
 */
function resolveAuthParams(): NavMenuParams | null {
    const token = tokenStorage.getToken();
    if (!token) return null;

    const user = tokenStorage.getUser<User>();
    const decoded = tokenStorage.decodeToken<Record<string, unknown>>();

    // 1. Resolve User ID
    const userId = String(
        user?.id ?? decoded?.user_id ?? decoded?.id ?? decoded?.sub ?? '1'
    );

    // 2. Resolve Role ID (must be a numeric identifier like '1', '2', etc.)
    let roleId = '';
    const rawRoleId = user?.role_id ?? user?.roleId ?? decoded?.role_id ?? decoded?.roleId;
    if (rawRoleId !== undefined && rawRoleId !== null && String(rawRoleId).trim() !== '') {
        roleId = String(rawRoleId);
    } else if (user?.role) {
        const roleStr = String(user.role).trim();
        if (/^\d+$/.test(roleStr)) {
            roleId = roleStr;
        } else {
            roleId = ROLE_NAME_TO_ID[roleStr.toLowerCase()] || '1';
        }
    } else {
        roleId = '1';
    }

    return { userId, roleId };
}

/**
 * Domain-specific Sidebar hook built on top of the master `useApi` pattern.
 * Reads user_id and role_id from the authenticated user,
 * then fetches the nav-menu from /api/auth/nav-menu/{userId}/{roleId}.
 */
export function useSidebar(): UseSidebarReturn {
    const [authParams, setAuthParams] = useState<NavMenuParams | null>(() => resolveAuthParams());

    useEffect(() => {
        const resolved = resolveAuthParams();
        if (
            resolved &&
            (resolved.userId !== authParams?.userId || resolved.roleId !== authParams?.roleId)
        ) {
            setAuthParams(resolved);
        }
    }, [authParams]);

    const initialParams = useMemo(
        () => authParams ?? { userId: '1', roleId: '1' },
        [authParams]
    );

    const hasAuth = !!tokenStorage.getToken();

    const { data, isLoading, isError, error, execute } = useApi(
        sidebarService.getNavMenu,
        {
            immediate: hasAuth,
            initialParams,
            suspense: false // Use standard useEffect lifecycle instead of throwing Suspense promises
        }
    );

    // Ensure API is called when authParams become available
    const executedRef = useRef<string>('');
    useEffect(() => {
        if (!hasAuth || !authParams) return;
        const key = `${authParams.userId}:${authParams.roleId}`;
        if (executedRef.current !== key) {
            executedRef.current = key;
            execute(authParams).catch(() => {
                // Handled internally in useApi
            });
        }
    }, [hasAuth, authParams, execute]);

    const menuData = useMemo(() => {
        if (Array.isArray(data?.data) && data.data.length > 0) {
            return data.data;
        }
        if (Array.isArray(data) && data.length > 0) {
            return data as unknown as NavMenuItem[];
        }
        // Fall back to predefined static menu so navigation is never blank
        return NAV_MENU_DATA;
    }, [data]);

    const refetch = useCallback(() => {
        const currentParams = resolveAuthParams() ?? { userId: '1', roleId: '1' };
        return execute(currentParams);
    }, [execute]);

    return {
        menuData,
        isLoading,
        isError,
        error,
        refetch
    };
}

export default useSidebar;

