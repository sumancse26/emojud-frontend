import { useState, useMemo, useCallback, useEffect } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { categoryService } from '../services/categoryService';
import type {
    ProductCategoryItem,
    CreateUpdateCategoryPayload,
    CategoryListResponse,
    CategoryMutationResponse
} from '../types/category.types';

export interface UseCategoryOptions {
    immediate?: boolean;
    autoRefetchOnMutation?: boolean;
    loadSubcategories?: boolean;
    onSuccess?: (data: CategoryListResponse) => void;
    onError?: (error: string) => void;
}

export interface UseCategoryReturn {
    // ─── Query (List) State ───────────────────────────────────────────
    categories: ProductCategoryItem[];
    rawResponse: CategoryListResponse | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => Promise<CategoryListResponse>;
    fetchCategories: () => Promise<CategoryListResponse>;
    fetchSubCategories: (categoryId: string | number) => Promise<ProductCategoryItem[]>;

    // ─── Mutation (Create / Update) State ─────────────────────────────
    createOrUpdateCategory: (payload: CreateUpdateCategoryPayload) => Promise<CategoryMutationResponse>;
    isSaving: boolean;
    isSaveSuccess: boolean;
    isSaveError: boolean;
    saveError: string | null;
    lastSavedCategory: CategoryMutationResponse | null;
    resetMutation: () => void;
}

export function useCategory(options: UseCategoryOptions = {}): UseCategoryReturn {
    const {
        immediate = true,
        autoRefetchOnMutation = true,
        loadSubcategories = true,
        onSuccess,
        onError
    } = options;

    const [subcategoriesMap, setSubcategoriesMap] = useState<Record<string, ProductCategoryItem[]>>({});

    // ─── 1. Query: Fetch Main Categories ───────────────────────────────
    const {
        data: rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        execute: executeFetch
    } = useApi<CategoryListResponse, void>(() => categoryService.getCategories(), {
        immediate,
        onSuccess,
        onError
    });

    // ─── 2. Mutation: Create or Update Category ────────────────────────
    const {
        data: lastSavedCategory,
        isLoading: isSaving,
        isSuccess: isSaveSuccess,
        isError: isSaveError,
        error: saveError,
        execute: executeMutation,
        reset: resetMutation
    } = useApi<CategoryMutationResponse, CreateUpdateCategoryPayload>((payload) =>
        categoryService.createOrUpdateCategory(payload)
    );

    // ─── Extract Normalized Categories List ────────────────────────────
    const rawCategories = useMemo<ProductCategoryItem[]>(() => {
        if (!rawResponse) return [];
        if (Array.isArray(rawResponse)) return rawResponse;
        if (typeof rawResponse === 'object' && 'data' in rawResponse && Array.isArray(rawResponse.data)) {
            return rawResponse.data;
        }
        return [];
    }, [rawResponse]);

    // ─── Fetch Subcategories for a given category ──────────────────────
    const fetchSubCategories = useCallback(
        async (categoryId: string | number): Promise<ProductCategoryItem[]> => {
            try {
                const res = await categoryService.getSubCategories(categoryId);
                const items = Array.isArray(res)
                    ? res
                    : typeof res === 'object' && 'data' in res && Array.isArray(res.data)
                    ? res.data
                    : [];

                setSubcategoriesMap((prev) => ({
                    ...prev,
                    [String(categoryId)]: items
                }));
                return items;
            } catch (err) {
                console.error(`Failed to fetch subcategories for category ${categoryId}:`, err);
                return [];
            }
        },
        []
    );

    // Automatically fetch subcategories for loaded categories
    useEffect(() => {
        if (loadSubcategories && rawCategories.length > 0) {
            rawCategories.forEach((cat) => {
                fetchSubCategories(cat.id);
            });
        }
    }, [rawCategories, loadSubcategories, fetchSubCategories]);

    // Merge subcategories into categories
    const categories = useMemo<ProductCategoryItem[]>(() => {
        return rawCategories.map((cat) => ({
            ...cat,
            subcategories: subcategoriesMap[String(cat.id)] ?? []
        }));
    }, [rawCategories, subcategoriesMap]);

    // ─── Execute create/update and optionally trigger refetch ──────────
    const createOrUpdateCategory = useCallback(
        async (payload: CreateUpdateCategoryPayload): Promise<CategoryMutationResponse> => {
            const response = await executeMutation(payload);
            if (autoRefetchOnMutation) {
                await executeFetch();
                if (payload.parent_category_id) {
                    await fetchSubCategories(payload.parent_category_id);
                }
            }
            return response;
        },
        [executeMutation, autoRefetchOnMutation, executeFetch, fetchSubCategories]
    );

    return {
        categories,
        rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: executeFetch,
        fetchCategories: executeFetch,
        fetchSubCategories,

        createOrUpdateCategory,
        isSaving,
        isSaveSuccess,
        isSaveError,
        saveError,
        lastSavedCategory,
        resetMutation
    };
}

export default useCategory;
