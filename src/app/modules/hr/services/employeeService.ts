import { axios } from '@/shared/services/apiClient';
import type {
    CreateEmployeePayload,
    EmployeeListParams,
    EmployeeListResponse,
    EmployeeMutationResponse
} from '../types/employee.types';

export const employeeService = {
    /**
     * Fetch the list of employees
     * GET /api/employees?shop_id=...
     */
    async getEmployees(params: EmployeeListParams): Promise<EmployeeListResponse> {
        return axios.get<EmployeeListResponse>('/api/employees', params as Record<string, unknown>);
    },

    /**
     * Create a new employee
     * POST /api/employee/create
     */
    async createEmployee(payload: CreateEmployeePayload): Promise<EmployeeMutationResponse> {
        return axios.post<EmployeeMutationResponse>('/api/employee/create', payload);
    }
};

export default employeeService;
