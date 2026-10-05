import React, { lazy } from 'react';

// ==========================================
// Lazy Loaded Module Page Components
// ==========================================

// 1. Auth Module
export const LoginPage = lazy(() =>
    import('../modules/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);

// 2. Home / Dashboard Module
export const DashboardPage = lazy(() =>
    import('../modules/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);

// 3. Configurations Module
export const ShopsPage = lazy(() =>
    import('../modules/configurations/pages/ShopsPage').then((m) => ({ default: m.ShopsPage }))
);
export const WarehousePage = lazy(() =>
    import('../modules/configurations/pages/WarehousePage').then((m) => ({ default: m.WarehousePage }))
);
export const ProductCategoryPage = lazy(() =>
    import('../modules/configurations/pages/ProductCategoryPage').then((m) => ({ default: m.ProductCategoryPage }))
);
export const UserShopPermissionPage = lazy(() =>
    import('../modules/configurations/pages/UserShopPermissionPage').then((m) => ({ default: m.UserShopPermissionPage }))
);

// 4. HR Module
export const EmployeesPage = lazy(() =>
    import('../modules/hr/pages/EmployeesPage').then((m) => ({ default: m.EmployeesPage }))
);
export const DepartmentsPage = lazy(() =>
    import('../modules/hr/pages/DepartmentsPage').then((m) => ({ default: m.DepartmentsPage }))
);
export const DesignationPage = lazy(() =>
    import('../modules/hr/pages/DesignationPage').then((m) => ({ default: m.DesignationPage }))
);
export const RolesPage = lazy(() =>
    import('../modules/hr/pages/RolesPage').then((m) => ({ default: m.RolesPage }))
);
export const UserRolesPage = lazy(() =>
    import('../modules/hr/pages/UserRolesPage').then((m) => ({ default: m.UserRolesPage }))
);

// 5. Products & Inventory Modules
export const ProductsPage = lazy(() =>
    import('../modules/products/pages/ProductsPage').then((m) => ({ default: m.ProductsPage }))
);
export const SuppliersPage = lazy(() =>
    import('../modules/suppliers/pages/SuppliersPage').then((m) => ({ default: m.SuppliersPage }))
);
export const CustomersPage = lazy(() =>
    import('../modules/customers/pages/CustomersPage').then((m) => ({ default: m.CustomersPage }))
);
export const InvoicesPage = lazy(() =>
    import('../modules/invoices/pages/InvoicesPage').then((m) => ({ default: m.InvoicesPage }))
);

// 6. Stock Management Module
export const PurchasesPage = lazy(() =>
    import('../modules/purchases/pages/PurchasesPage').then((m) => ({ default: m.PurchasesPage }))
);
export const StockSummaryPage = lazy(() =>
    import('../modules/stock/pages/StockSummaryPage').then((m) => ({ default: m.StockSummaryPage }))
);

// 7. Accounts Module
export const ExpensesPage = lazy(() =>
    import('../modules/accounts/pages/ExpensesPage').then((m) => ({ default: m.ExpensesPage }))
);
export const SalaryPage = lazy(() =>
    import('../modules/accounts/pages/SalaryPage').then((m) => ({ default: m.SalaryPage }))
);
export const SupplierPaymentPage = lazy(() =>
    import('../modules/accounts/pages/SupplierPaymentPage').then((m) => ({ default: m.SupplierPaymentPage }))
);
export const CustomerDueCollectionPage = lazy(() =>
    import('../modules/accounts/pages/CustomerDueCollectionPage').then((m) => ({ default: m.CustomerDueCollectionPage }))
);
export const CommissionProfitPage = lazy(() =>
    import('../modules/accounts/pages/CommissionProfitPage').then((m) => ({ default: m.CommissionProfitPage }))
);

// 8. Reports Module
export const ReportsPage = lazy(() =>
    import('../modules/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);
export const DailySalesReportPage = lazy(() =>
    import('../modules/reports/pages/DailySalesReportPage').then((m) => ({ default: m.DailySalesReportPage }))
);
export const DailyPurchaseReportPage = lazy(() =>
    import('../modules/reports/pages/DailyPurchaseReportPage').then((m) => ({ default: m.DailyPurchaseReportPage }))
);
export const StockSummaryReportPage = lazy(() =>
    import('../modules/reports/pages/StockSummaryReportPage').then((m) => ({ default: m.StockSummaryReportPage }))
);
export const CustomerDueReportPage = lazy(() =>
    import('../modules/reports/pages/CustomerDueReportPage').then((m) => ({ default: m.CustomerDueReportPage }))
);
export const SupplierDueReportPage = lazy(() =>
    import('../modules/reports/pages/SupplierDueReportPage').then((m) => ({ default: m.SupplierDueReportPage }))
);
export const DailyExpenseReportPage = lazy(() =>
    import('../modules/reports/pages/DailyExpenseReportPage').then((m) => ({ default: m.DailyExpenseReportPage }))
);
export const GrossProfitReportPage = lazy(() =>
    import('../modules/reports/pages/GrossProfitReportPage').then((m) => ({ default: m.GrossProfitReportPage }))
);
export const CashFlowReportPage = lazy(() =>
    import('../modules/reports/pages/CashFlowReportPage').then((m) => ({ default: m.CashFlowReportPage }))
);
export const ProductLedgerReportPage = lazy(() =>
    import('../modules/reports/pages/ProductLedgerReportPage').then((m) => ({ default: m.ProductLedgerReportPage }))
);
export const CollectionReportPage = lazy(() =>
    import('../modules/reports/pages/CollectionReportPage').then((m) => ({ default: m.CollectionReportPage }))
);

export { FeaturePlaceholder } from './FeaturePlaceholder';

// Loading Fallback Spinner
export const PageLoader: React.FC = () => (
    <div className="flex h-[60vh] min-h-[280px] w-full items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3.5">
            <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-[3px] border-emerald-500/20 border-t-emerald-500 animate-spin" />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-center">
                <p className="text-xs font-semibold tracking-wider text-slate-700 dark:text-slate-300 uppercase">
                    Loading Module
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Preparing ERP interface...
                </p>
            </div>
        </div>
    </div>
);
