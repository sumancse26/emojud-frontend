import { axios } from '@/shared/services/apiClient';
import type {
    RoleListResponse,
    CreateRolePayload,
    RoleMutationResponse
} from '../types/role.types';

export const roleService = {
    /**
     * Fetch the list of roles
     * GET /api/role
     */
    async getRoles(): Promise<RoleListResponse> {
        return axios.get<RoleListResponse>('/api/role');
    },

    /**
     * Create or update a role
     * POST /api/role
     */
    async createOrUpdateRole(payload: CreateRolePayload): Promise<RoleMutationResponse> {
        return axios.post<RoleMutationResponse>('/api/role', payload);
    }
};

export default roleService;
