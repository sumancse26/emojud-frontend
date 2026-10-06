import { axios } from '@/shared/services/apiClient';
import type { NavMenuResponse } from '@/app/routes/types';

export interface NavMenuParams {
    userId: string;
    roleId: string;
}

export const sidebarService = {
    /**
     * Fetch the nav-menu items for the given user and role.
     * GET /api/auth/nav-menu/{userId}/{roleId}
     */
    async getNavMenu(params: NavMenuParams): Promise<NavMenuResponse> {
        return axios.get<NavMenuResponse>(
            `/api/auth/nav-menu/${params.userId}/${params.roleId}`
        );
    }
};
