import React, { useState, useEffect, useMemo } from 'react';
import { useUserShopPermission } from '../hooks/useUserShopPermission';
import { useShop } from '../hooks/useShop';
import { UserShopPermissionPresenter } from './presenters/UserShopPermissionPresenter';
import { tokenStorage } from '@/shared/services/tokenStorage';
import { useToast } from '@/shared/components/Toast';
import type { User } from '@/app/modules/auth/types/auth.types';
import type { UserWisePermissionItem, UserPermissionPayloadItem } from '../types/permission.types';

export interface UserPermissionMatrixRow {
    userId: string | number;
    userName: string;
    username: string;
    email: string;
    phone: string;
    employeeCode: string;
    // Maps shop_id to permission record id (or null if new)
    shopPermissions: Record<string | number, string | number | null>;
}

export const UserShopPermissionPage: React.FC = () => {
    const loginUser = tokenStorage.getUser<User>();
    const userCompanyId = Number(loginUser?.branchId ?? 1);
    const loginUserId = Number(loginUser?.id ?? 1);

    const {
        permissions,
        isLoading: isPermissionsLoading,
        isError,
        error,
        savePermissions,
        isSaving,
        refetch
    } = useUserShopPermission();

    const { shops, isLoading: isShopsLoading } = useShop();
    const toast = useToast();

    // Local matrix state of user permissions: userId -> UserPermissionMatrixRow
    const [matrix, setMatrix] = useState<Record<string | number, UserPermissionMatrixRow>>({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Synchronize fetched permissions into the matrix
    useEffect(() => {
        if (!permissions) return;

        const newMatrix: Record<string | number, UserPermissionMatrixRow> = {};

        permissions.forEach((item: UserWisePermissionItem) => {
            const uid = item.user_id || item.user?.id;
            if (!uid) return;

            if (!newMatrix[uid]) {
                const emp = item.user?.employee;
                newMatrix[uid] = {
                    userId: uid,
                    userName: emp?.full_name || item.user?.username || `User #${uid}`,
                    username: item.user?.username || '',
                    email: emp?.email || '',
                    phone: emp?.phone || '',
                    employeeCode: emp?.employee_code || '',
                    shopPermissions: {}
                };
            }

            const shopId = item.shop?.id;
            if (shopId) {
                newMatrix[uid].shopPermissions[shopId] = item.id ?? null;
            }
        });

        setMatrix(newMatrix);
        setHasUnsavedChanges(false);
    }, [permissions]);

    const userRows = useMemo<UserPermissionMatrixRow[]>(() => {
        return Object.values(matrix);
    }, [matrix]);

    // Toggle permission for a given user and shop
    const handleTogglePermission = (userId: string | number, shopId: string | number) => {
        setMatrix((prev) => {
            const currentUser = prev[userId];
            if (!currentUser) return prev;

            const currentShopPermissions = { ...currentUser.shopPermissions };
            const isCurrentlyAllowed = shopId in currentShopPermissions;

            if (isCurrentlyAllowed) {
                delete currentShopPermissions[shopId];
            } else {
                currentShopPermissions[shopId] = null; // newly added
            }

            return {
                ...prev,
                [userId]: {
                    ...currentUser,
                    shopPermissions: currentShopPermissions
                }
            };
        });
        setHasUnsavedChanges(true);
    };

    // Save all active permissions
    const handleSave = async () => {
        const payloadData: UserPermissionPayloadItem[] = [];

        Object.values(matrix).forEach((row) => {
            Object.entries(row.shopPermissions).forEach(([shopId, permissionId]) => {
                payloadData.push({
                    id: permissionId ? Number(permissionId) : null,
                    user_id: Number(row.userId),
                    shop_id: Number(shopId),
                    company_id: userCompanyId,
                    login_user_id: loginUserId
                });
            });
        });

        try {
            await savePermissions({ data: payloadData });
            toast.success('User shop permissions saved successfully!');
            setHasUnsavedChanges(false);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to save user permissions. Please try again.';
            toast.error(errorMsg);
            console.error('Failed to save user permissions:', err);
        }
    };

    const isLoading = isPermissionsLoading || isShopsLoading;

    return (
        <UserShopPermissionPresenter
            userRows={userRows}
            shops={shops}
            isLoading={isLoading}
            isError={isError}
            error={error}
            isSaving={isSaving}
            hasUnsavedChanges={hasUnsavedChanges}
            onTogglePermission={handleTogglePermission}
            onSave={handleSave}
            onRefetch={() => refetch()}
        />
    );
};

export default UserShopPermissionPage;
