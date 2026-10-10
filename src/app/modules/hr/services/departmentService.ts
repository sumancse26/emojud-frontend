import { axios } from '@/shared/services/apiClient';
import type {
    DepartmentListResponse,
    CreateDepartmentPayload,
    DepartmentMutationResponse
} from '../types/department.types';

export const departmentService = {
    /**
     * Fetch the list of departments
     * GET /api/departments
     */
    async getDepartments(): Promise<DepartmentListResponse> {
        return axios.get<DepartmentListResponse>('/api/departments');
    },

    /**
     * Create or update a department
     * POST /api/departments
     */
    async createOrUpdateDepartment(payload: CreateDepartmentPayload): Promise<DepartmentMutationResponse> {
        return axios.post<DepartmentMutationResponse>('/api/departments', payload);
    }
};

export default departmentService;
