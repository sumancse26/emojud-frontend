import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface UserShopPermission {
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
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        User Shop & Counter Permissions
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Control which operators can bill, view stock, or switch active branch outlets.
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto">
                    <Save className="w-4 h-4" />
                    <span>{isSaved ? 'Changes Saved!' : 'Save Access Rules'}</span>
                </button>
            </div>

            {/* Permission Matrix Table */}
            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <tr>
                                <th className="px-5 py-3">Operator & Role</th>
                                <th className="px-4 py-3 text-center">Dhanmondi Outlet</th>
                                <th className="px-4 py-3 text-center">Gulshan Outlet</th>
                                <th className="px-4 py-3 text-center">Uttara Outlet</th>
                                <th className="px-4 py-3 text-center">Central WH (Savar)</th>
                                <th className="px-4 py-3 text-center">POS Discount Allowed</th>
                                <th className="px-4 py-3 text-center">POS Refund Allowed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {permissions.map((user) => (
                                <tr key={user.userId} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">
                                                {user.userName}
                                            </p>
                                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                                {user.role} • <span className="text-slate-400 font-mono">{user.email}</span>
                                            </p>
                                        </div>
                                    </td>

                                    {/* Dhanmondi */}
                                    <td className="px-4 py-3.5 text-center">
                                        <input
                                            type="checkbox"
                                            checked={user.outletPermissions.dhanmondi}
                                            onChange={() => toggleOutlet(user.userId, 'dhanmondi')}
                                            className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                                        />
                                    </td>

                                    {/* Gulshan */}
                                    <td className="px-4 py-3.5 text-center">
                                        <input
                                            type="checkbox"
                                            checked={user.outletPermissions.gulshan}
                                            onChange={() => toggleOutlet(user.userId, 'gulshan')}
                                            className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                                        />
                                    </td>

                                    {/* Uttara */}
                                    <td className="px-4 py-3.5 text-center">
                                        <input
                                            type="checkbox"
                                            checked={user.outletPermissions.uttara}
                                            onChange={() => toggleOutlet(user.userId, 'uttara')}
                                            className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                                        />
                                    </td>

                                    {/* Central WH */}
                                    <td className="px-4 py-3.5 text-center">
                                        <input
                                            type="checkbox"
                                            checked={user.outletPermissions.warehouseSavar}
                                            onChange={() => toggleOutlet(user.userId, 'warehouseSavar')}
                                            className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                                        />
                                    </td>

                                    {/* Discount */}
                                    <td className="px-4 py-3.5 text-center">
                                        <span
                                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                user.canIssueDiscounts
                                                    ? 'bg-emerald-500/10 text-emerald-600'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                            }`}>
                                            {user.canIssueDiscounts ? 'YES' : 'NO'}
                                        </span>
                                    </td>

                                    {/* Refund */}
                                    <td className="px-4 py-3.5 text-center">
                                        <span
                                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                user.canRefundPOS
                                                    ? 'bg-emerald-500/10 text-emerald-600'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                            }`}>
                                            {user.canRefundPOS ? 'YES' : 'NO'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};
