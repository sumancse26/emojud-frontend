export interface DesignationItem {
    id: string;
    display_code?: string;
    designation_name: string;
    status?: number;
}

export interface DesignationListResponse {
    success: boolean;
    response_code: number;
    data: DesignationItem[];
}

export interface CreateDesignationPayload {
    id: number;
    designation_name: string;
    status: number;
}

export interface DesignationMutationResponse {
    success: boolean;
    response_code: number;
    message?: string;
    data?: DesignationItem | unknown;
}
