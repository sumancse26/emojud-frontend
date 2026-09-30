import React, { useState } from 'react';
import { UserShopPermissionPresenter } from './presenters/UserShopPermissionPresenter';

export interface UserShopPermission {
    userId: string;
    userName: string;
    role: string;
    email: string;
    outletPermissions: {
        dhanmondi: boolean;
        gulshan: boolean;
        uttara: boolean;
        warehouseSavar: boolean;
    };
    canIssueDiscounts: boolean;
    canRefundPOS: boolean;
}

const MOCK_PERMISSIONS: UserShopPermission[] = [
    {
        userId: 'U-001',
        userName: 'Suman Roy (Admin)',
        role: 'Super Administrator',
        email: 'suman.admin@emojud.com',
        outletPermissions: { dhanmondi: true, gulshan: true, uttara: true, warehouseSavar: true },
        canIssueDiscounts: true,
        canRefundPOS: true
    },
    {
        userId: 'U-002',
        userName: 'Tanvir Hossain',
        role: 'Branch Manager',
        email: 'tanvir@emojud.com',
        outletPermissions: { dhanmondi: true, gulshan: false, uttara: false, warehouseSavar: true },
        canIssueDiscounts: true,
        canRefundPOS: true
    },
    {
        userId: 'U-003',
        userName: 'Sadia Afreen',
        role: 'Head Cashier',
        email: 'sadia.cash@emojud.com',
        outletPermissions: { dhanmondi: true, gulshan: false, uttara: false, warehouseSavar: false },
        canIssueDiscounts: false,
        canRefundPOS: false
    },
    {
        userId: 'U-004',
        userName: 'Kamrul Islam',
        role: 'Warehouse Controller',
        email: 'kamrul.wh@emojud.com',
        outletPermissions: { dhanmondi: false, gulshan: false, uttara: false, warehouseSavar: true },
        canIssueDiscounts: false,
        canRefundPOS: false
    }
];

export const UserShopPermissionPage: React.FC = () => {
    const [permissions, setPermissions] = useState<UserShopPermission[]>(MOCK_PERMISSIONS);
    const [isSaved, setIsSaved] = useState(false);

    const toggleOutlet = (userId: string, outletKey: keyof UserShopPermission['outletPermissions']) => {
        setPermissions((prev) =>
            prev.map((user) => {
                if (user.userId === userId) {
                    return {
                        ...user,
                        outletPermissions: {
                            ...user.outletPermissions,
                            [outletKey]: !user.outletPermissions[outletKey]
                        }
                    };
                }
                return user;
            })
        );
        setIsSaved(false);
    };

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <UserShopPermissionPresenter
            permissions={permissions}
            isSaved={isSaved}
            onToggleOutlet={toggleOutlet}
            onSave={handleSave}
        />
    );
};

export default UserShopPermissionPage;
