import { axios } from '@/shared/services/apiClient';
import type {
    DesignationListResponse,
    CreateDesignationPayload,
    DesignationMutationResponse
} from '../types/designation.types';

export const designationService = {
    /**
     * Fetch the list of designations
     * GET /api/designation
     */
    async getDesignations(): Promise<DesignationListResponse> {
        return axios.get<DesignationListResponse>('/api/designation');
    },

    /**
     * Create or update a designation
     * POST /api/designation
     */
    async createOrUpdateDesignation(payload: CreateDesignationPayload): Promise<DesignationMutationResponse> {
        return axios.post<DesignationMutationResponse>('/api/designation', payload);
    }
};

export default designationService;
