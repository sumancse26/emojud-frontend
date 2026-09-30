import React from 'react';
import { Save } from 'lucide-react';
import { PageHeader, Pagination } from '@/shared';
import type { UserShopPermission } from '../UserShopPermissionPage';

export interface UserShopPermissionPresenterProps {
    permissions: UserShopPermission[];
    isSaved: boolean;
    onToggleOutlet: (userId: string, outletKey: keyof UserShopPermission['outletPermissions']) => void;
    onSave: () => void;
}

export const UserShopPermissionPresenter: React.FC<UserShopPermissionPresenterProps> = ({
    permissions,
    isSaved,
    onToggleOutlet,
    onSave
}) => {
    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="User Shop & Counter Permissions"
                    description="Control which operators can bill, view stock, or switch active branch outlets."
                    actions={
                        <button
                            onClick={onSave}
                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            <Save className="w-4 h-4" />
                            <span>{isSaved ? 'Changes Saved!' : 'Save Access Rules'}</span>
                        </button>
                    }
                />
            </PageHeader>

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
                                <tr
                                    key={user.userId}
                                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
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
                                            onChange={() => onToggleOutlet(user.userId, 'dhanmondi')}
                                            className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                                        />
                                    </td>

                                    {/* Gulshan */}
                                    <td className="px-4 py-3.5 text-center">
                                        <input
                                            type="checkbox"
                                            checked={user.outletPermissions.gulshan}
                                            onChange={() => onToggleOutlet(user.userId, 'gulshan')}
                                            className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                                        />
                                    </td>

                                    {/* Uttara */}
                                    <td className="px-4 py-3.5 text-center">
                                        <input
                                            type="checkbox"
                                            checked={user.outletPermissions.uttara}
                                            onChange={() => onToggleOutlet(user.userId, 'uttara')}
                                            className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                                        />
                                    </td>

                                    {/* Central WH */}
                                    <td className="px-4 py-3.5 text-center">
                                        <input
                                            type="checkbox"
                                            checked={user.outletPermissions.warehouseSavar}
                                            onChange={() => onToggleOutlet(user.userId, 'warehouseSavar')}
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

                {/* Pagination footer */}
                <Pagination
                    totalItems={permissions.length}
                    pageSize={10}
                    itemLabel="permissions"
                />
            </div>
        </section>
    );
};

export default UserShopPermissionPresenter;
