export interface DepartmentItem {
    id: string;
    display_code?: string;
    department_name: string;
    company_id?: string;
    status?: number;
}

export interface DepartmentListResponse {
    success: boolean;
    response_code: number;
    data: DepartmentItem[];
}

export interface CreateDepartmentPayload {
    id: number;
    department_name: string;
    status: number;
}

export interface DepartmentMutationResponse {
    success: boolean;
    response_code: number;
    message?: string;
    data?: DepartmentItem | unknown;
}
