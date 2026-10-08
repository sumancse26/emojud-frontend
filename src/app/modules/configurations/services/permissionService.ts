import { axios } from '@/shared/services/apiClient';
import type {
    SaveUserPermissionsPayload,
    UserWisePermissionListResponse,
    SaveUserPermissionsResponse
} from '../types/permission.types';

export const permissionService = {
    /**
     * Fetch user shop permissions list
     * GET /api/user-wise-permission
     */
    async getUserWisePermissions(): Promise<UserWisePermissionListResponse> {
        return axios.get<UserWisePermissionListResponse>('/api/user-wise-permission');
    },

    /**
     * Save / Update user shop permissions
     * POST /api/user-wise-permission
     */
    async saveUserPermissions(payload: SaveUserPermissionsPayload): Promise<SaveUserPermissionsResponse> {
        return axios.post<SaveUserPermissionsResponse>('/api/user-wise-permission', payload);
    }
};

export default permissionService;
