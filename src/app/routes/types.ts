export interface NavMenuItem {
    id: string;
    feature_name: string;
    module_name: string;
    route_url: string | null;
    parent: string | null;
    feature_icon: string | null;
    children?: NavMenuItem[];
}

export interface NavMenuResponse {
    success: boolean;
    response_code: number;
    message: string;
    data: NavMenuItem[];
}

export interface BreadcrumbItem {
    label: string;
    path?: string;
}
