export interface UserShopItem {
    id: string | number;
    shop_name: string;
    display_code?: string | null;
    short_code?: string | null;
}

export interface EmployeeInfo {
    id: string | number;
    employee_code?: string | null;
    full_name: string;
    phone?: string | null;
    email?: string | null;
}

export interface UserInfo {
    id: string | number;
    employee_id?: string | number | null;
    username: string;
    employee?: EmployeeInfo | null;
}

export interface UserWisePermissionItem {
    id: string | number;
    user_id: string | number;
    company_id: string | number;
    shop: UserShopItem;
    user: UserInfo;
    [key: string]: unknown;
}

export interface UserPermissionPayloadItem {
    id?: string | number | null;
    user_id: string | number;
    shop_id: string | number;
    company_id: string | number;
    login_user_id: string | number;
}

export interface SaveUserPermissionsPayload {
    data: UserPermissionPayloadItem[];
}

export interface PermissionApiResponse<T> {
    success?: boolean;
    data: T;
    message?: string;
    response_code?: number;
}

export type UserWisePermissionListResponse =
    | UserWisePermissionItem[]
    | PermissionApiResponse<UserWisePermissionItem[]>;

export type SaveUserPermissionsResponse =
    | unknown
    | PermissionApiResponse<unknown>;
