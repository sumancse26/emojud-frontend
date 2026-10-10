export interface RoleItem {
    id: string;
    short_code?: string;
    role_name: string;
    status?: number;
    company_id?: string | number;
    user_id?: string | number;
}

export interface RoleListResponse {
    success: boolean;
    response_code: number;
    data: RoleItem[];
}

export interface CreateRolePayload {
    id: number;
    role_name: string;
    status: number;
    company_id?: number;
    user_id?: number;
}

export interface RoleMutationResponse {
    success: boolean;
    response_code: number;
    message?: string;
    data?: RoleItem | unknown;
}
