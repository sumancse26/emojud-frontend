import React from 'react';
import { Save, User, Store, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { PageHeader, Pagination, Skeleton } from '@/shared';
import type { UserPermissionMatrixRow } from '../UserShopPermissionPage';
import type { ShopItem } from '../../types/shop.types';

export interface UserShopPermissionPresenterProps {
    userRows: UserPermissionMatrixRow[];
    shops: ShopItem[];
    isLoading?: boolean;
    isError?: boolean;
    error?: string | null;
    isSaving: boolean;
    hasUnsavedChanges: boolean;
    onTogglePermission: (userId: string | number, shopId: string | number) => void;
    onSave: () => void;
    onRefetch: () => void;
}

export const UserShopPermissionPresenter: React.FC<UserShopPermissionPresenterProps> = ({
    userRows,
    shops,
    isLoading = false,
    isError = false,
    error,
    isSaving,
    hasUnsavedChanges,
    onTogglePermission,
    onSave,
    onRefetch
}) => {
    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="User Shop & Counter Permissions"
                    description="Configure which operators and employees have access to transact across store branches."
                    actions={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onRefetch}
                                disabled={isLoading || isSaving}
                                title="Refresh permissions"
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={onSave}
                                disabled={isSaving || isLoading}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                                    hasUnsavedChanges
                                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20 animate-pulse'
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                                }`}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>{hasUnsavedChanges ? 'Save Changes *' : 'Save Permissions'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    }
                />
            </PageHeader>

            {/* Error Notification */}
            {isError && (
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error || 'Failed to load user permissions. Please try again.'}</span>
                    </div>
                    <button
                        onClick={onRefetch}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition cursor-pointer">
                        Retry
                    </button>
                </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && (
                <Skeleton.Table rows={5} columns={Math.max(3, shops.length + 1)} hasHeader={true} />
            )}

            {/* Empty State */}
            {!isLoading && !isError && userRows.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <User className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        No User Permissions Found
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                        There are currently no user permission records configured for your company.
                    </p>
                </div>
            )}

            {/* Dynamic Permission Matrix Table */}
            {!isLoading && userRows.length > 0 && (
                <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                                <tr>
                                    <th className="px-5 py-3.5 min-w-[220px]">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            <span>Operator / User</span>
                                        </div>
                                    </th>
                                    {shops.map((shop) => (
                                        <th key={shop.id} className="px-4 py-3.5 text-center min-w-[140px]">
                                            <div className="flex flex-col items-center justify-center gap-0.5">
                                                <span className="text-slate-700 dark:text-slate-200 font-bold">
                                                    {shop.shop_name}
                                                </span>
                                                <span className="text-[10px] font-mono font-medium text-slate-400">
                                                    {shop.short_code || shop.display_code || `#${shop.id}`}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {userRows.map((user) => (
                                    <tr
                                        key={user.userId}
                                        className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">
                                                    {user.userName}
                                                </p>
                                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                                    @{user.username}{' '}
                                                    {user.employeeCode && (
                                                        <span className="text-slate-400 font-mono">
                                                            ({user.employeeCode})
                                                        </span>
                                                    )}
                                                </p>
                                                {user.email && (
                                                    <p className="text-[10px] text-slate-400 font-mono truncate">
                                                        {user.email}
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Dynamic Shop Columns with Checkboxes */}
                                        {shops.map((shop) => {
                                            const isChecked = shop.id in user.shopPermissions;
                                            return (
                                                <td key={shop.id} className="px-4 py-4 text-center">
                                                    <label className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => onTogglePermission(user.userId, shop.id)}
                                                            className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600 focus:ring-emerald-500/30"
                                                        />
                                                    </label>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination footer */}
                    <Pagination
                        totalItems={userRows.length}
                        pageSize={10}
                        itemLabel="operators"
                    />
                </div>
            )}
        </section>
    );
};

export default UserShopPermissionPresenter;
