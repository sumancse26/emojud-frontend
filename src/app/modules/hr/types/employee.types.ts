/**
 * Employee types and API payload/response definitions
 */

export interface EmployeeDepartment {
    id: string;
    display_code?: string;
    department_name: string;
}

export interface EmployeeDesignation {
    id: string;
    display_code?: string;
    designation_name: string;
}

export interface EmployeeShop {
    id: string;
    display_code?: string;
    short_code?: string;
    shop_name: string;
    image?: string | null;
}

export interface EmployeeLookup {
    id: string;
    lookup_code: string;
    lookup_value: string;
}

export interface EmployeeItem {
    id: string;
    employee_code: string;
    full_name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    join_date: string | null;
    nid: string | null;
    passport_no: string | null;
    basic_salary: string | null;
    department: EmployeeDepartment | null;
    designation: EmployeeDesignation | null;
    shop: EmployeeShop | null;
    genderLookup: EmployeeLookup | null;
    bloodGroupLookup: EmployeeLookup | null;
    [key: string]: unknown;
}

export interface CreateEmployeePayload {
    employee_code: string;
    full_name: string;
    phone?: string;
    email?: string;
    address?: string;
    join_date?: string;
    department_id?: number | string;
    designation_id?: number | string;
    gender?: number | string;
    blood_group?: number | string;
    nid?: string;
    passport_no?: string;
    emp_photo?: number | string;
    nid_photo?: number | string;
    shop_id: number | string;
    basic_salary?: number | string;
    photo_url?: string;
    created_by?: number | string;
    username?: string;
    password?: string;
    default_role_id?: number | string;
    company_id?: number | string;
    user_id?: number | string;
    device_ip?: string;
    device_mac?: string;
    [key: string]: unknown;
}

export interface EmployeeListParams {
    shop_id: number | string;
    search?: string;
    [key: string]: unknown;
}

export interface EmployeeApiResponse<T> {
    success?: boolean;
    data: T;
    message?: string;
    response_code?: number;
}

export type EmployeeListResponse = EmployeeItem[] | EmployeeApiResponse<EmployeeItem[]>;
export type EmployeeMutationResponse = EmployeeItem | EmployeeApiResponse<EmployeeItem>;
