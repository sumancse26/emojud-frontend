import React, { lazy } from 'react';
import { Skeleton } from '@/shared/components/Skeleton';

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
    import('../modules/inventory/suppliers/pages/SuppliersPage').then((m) => ({ default: m.SuppliersPage }))
);
export const CustomersPage = lazy(() =>
    import('../modules/inventory/customers/pages/CustomersPage').then((m) => ({ default: m.CustomersPage }))
);
export const InvoicesPage = lazy(() =>
    import('../modules/inventory/invoices/pages/InvoicesPage').then((m) => ({ default: m.InvoicesPage }))
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

// Shared Suspense fallback for lazy pages and initial API reads. It mirrors
// the common ERP page shapes so the layout remains stable while data loads.
export const PageLoader: React.FC = () => (
    <div className="w-full space-y-6 p-2 lg:p-4" aria-busy="true" aria-label="Loading content">
        <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-3 w-72" />
            </div>
            <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        <Skeleton.Stats count={4} />

        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
        </div>

        <Skeleton.Table rows={5} columns={6} />
    </div>
);
