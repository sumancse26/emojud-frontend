import { axios } from '@/shared/services/apiClient';
import type {
    ProductCategoryItem,
    CreateUpdateCategoryPayload,
    CategoryListResponse,
    CategoryMutationResponse
} from '../types/category.types';

export const categoryService = {
    /**
     * Fetch list of main product categories
     * GET /api/product-category
     */
    async getCategories(): Promise<CategoryListResponse> {
        return axios.get<CategoryListResponse>('/api/product-category');
    },

    /**
     * Fetch subcategories of a given category
     * GET /api/product-sub-category/{categoryId}
     */
    async getSubCategories(categoryId: string | number): Promise<CategoryListResponse> {
        return axios.get<CategoryListResponse>(`/api/product-sub-category/${categoryId}`);
    },

    /**
     * Create or Update a category or subcategory
     * POST /api/product-category
     */
    async createOrUpdateCategory(payload: CreateUpdateCategoryPayload): Promise<CategoryMutationResponse> {
        return axios.post<CategoryMutationResponse>('/api/product-category', payload);
    }
};

export default categoryService;
