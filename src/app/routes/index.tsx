import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { MainLayout } from '@/layouts';
import { ROUTES } from './paths';
import { NotFoundPage } from './NotFoundPage';

// Lazy load feature pages for optimal bundle splitting and performance
const LoginPage = lazy(() =>
    import('@/app/modules/auth').then((m) => ({ default: m.LoginPage }))
);
const DashboardPage = lazy(() =>
    import('@/app/modules/dashboard').then((m) => ({ default: m.DashboardPage }))
);

// Configurations
const ShopsPage = lazy(() =>
    import('@/app/modules/configurations').then((m) => ({ default: m.ShopsPage }))
);
const WarehousePage = lazy(() =>
    import('@/app/modules/configurations').then((m) => ({ default: m.WarehousePage }))
);
const ProductCategoryPage = lazy(() =>
    import('@/app/modules/configurations').then((m) => ({ default: m.ProductCategoryPage }))
);
const UserShopPermissionPage = lazy(() =>
    import('@/app/modules/configurations').then((m) => ({ default: m.UserShopPermissionPage }))
);

// HR
const EmployeesPage = lazy(() =>
    import('@/app/modules/hr').then((m) => ({ default: m.EmployeesPage }))
);
const DepartmentsPage = lazy(() =>
    import('@/app/modules/hr').then((m) => ({ default: m.DepartmentsPage }))
);
const DesignationPage = lazy(() =>
    import('@/app/modules/hr').then((m) => ({ default: m.DesignationPage }))
);
const RolesPage = lazy(() =>
    import('@/app/modules/hr').then((m) => ({ default: m.RolesPage }))
);
const UserRolesPage = lazy(() =>
    import('@/app/modules/hr').then((m) => ({ default: m.UserRolesPage }))
);

// Products & Inventory
const ProductsPage = lazy(() =>
    import('@/app/modules/products').then((m) => ({ default: m.ProductsPage }))
);
const SuppliersPage = lazy(() =>
    import('@/app/modules/suppliers').then((m) => ({ default: m.SuppliersPage }))
);
const CustomersPage = lazy(() =>
    import('@/app/modules/customers').then((m) => ({ default: m.CustomersPage }))
);
const InvoicesPage = lazy(() =>
    import('@/app/modules/invoices').then((m) => ({ default: m.InvoicesPage }))
);

// Stock Management
const PurchasesPage = lazy(() =>
    import('@/app/modules/purchases').then((m) => ({ default: m.PurchasesPage }))
);
const StockSummaryPage = lazy(() =>
    import('@/app/modules/stock').then((m) => ({ default: m.StockSummaryPage }))
);

// Accounts
const ExpensesPage = lazy(() =>
    import('@/app/modules/accounts').then((m) => ({ default: m.ExpensesPage }))
);
const SalaryPage = lazy(() =>
    import('@/app/modules/accounts').then((m) => ({ default: m.SalaryPage }))
);
const SupplierPaymentPage = lazy(() =>
    import('@/app/modules/accounts').then((m) => ({ default: m.SupplierPaymentPage }))
);
const CustomerDueCollectionPage = lazy(() =>
    import('@/app/modules/accounts').then((m) => ({ default: m.CustomerDueCollectionPage }))
);
const CommissionProfitPage = lazy(() =>
    import('@/app/modules/accounts').then((m) => ({ default: m.CommissionProfitPage }))
);

// Reports
const ReportsPage = lazy(() =>
    import('@/app/modules/reports').then((m) => ({ default: m.ReportsPage }))
);
const DailySalesReportPage = lazy(() =>
    import('@/app/modules/reports').then((m) => ({ default: m.DailySalesReportPage }))
);
const DailyPurchaseReportPage = lazy(() =>
    import('@/app/modules/reports').then((m) => ({ default: m.DailyPurchaseReportPage }))
);
const StockSummaryReportPage = lazy(() =>
    import('@/app/modules/reports').then((m) => ({ default: m.StockSummaryReportPage }))
);
const CustomerDueReportPage = lazy(() =>
    import('@/app/modules/reports').then((m) => ({ default: m.CustomerDueReportPage }))
);
const SupplierDueReportPage = lazy(() =>
    import('@/app/modules/reports').then((m) => ({ default: m.SupplierDueReportPage }))
);
const DailyExpenseReportPage = lazy(() =>
    import('@/app/modules/reports').then((m) => ({ default: m.DailyExpenseReportPage }))
);
const GrossProfitReportPage = lazy(() =>
    import('@/app/modules/reports').then((m) => ({ default: m.GrossProfitReportPage }))
);
const CashFlowReportPage = lazy(() =>
    import('@/app/modules/reports').then((m) => ({ default: m.CashFlowReportPage }))
);
const ProductLedgerReportPage = lazy(() =>
    import('@/app/modules/reports').then((m) => ({ default: m.ProductLedgerReportPage }))
);
const CollectionReportPage = lazy(() =>
    import('@/app/modules/reports').then((m) => ({ default: m.CollectionReportPage }))
);

// Loading Fallback
const PageLoader: React.FC = () => (
    <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent shadow-xs" />
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Loading Module...
            </span>
        </div>
    </div>
);

export const AppRouter: React.FC = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public Auth Routes */}
                <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />

                {/* Root Redirection */}
                <Route
                    path={ROUTES.ROOT}
                    element={<Navigate to={ROUTES.HOME.DASHBOARD} replace />}
                />
                <Route
                    path={ROUTES.FEATURE_ROOT}
                    element={<Navigate to={ROUTES.HOME.DASHBOARD} replace />}
                />

                {/* Protected Enterprise ERP Feature Routes (Wrapped in MainLayout) */}
                <Route element={<MainLayout />}>
                    {/* 1. Home Module */}
                    <Route path={ROUTES.HOME.DASHBOARD} element={<DashboardPage />} />

                    {/* 2. Configurations Module */}
                    <Route path={ROUTES.CONFIGURATIONS.SHOPS} element={<ShopsPage />} />
                    <Route path={ROUTES.CONFIGURATIONS.WAREHOUSE} element={<WarehousePage />} />
                    <Route
                        path={ROUTES.CONFIGURATIONS.PRODUCT_CATEGORY}
                        element={<ProductCategoryPage />}
                    />
                    <Route
                        path={ROUTES.CONFIGURATIONS.USER_SHOP_PERMISSION}
                        element={<UserShopPermissionPage />}
                    />

                    {/* 3. HR Module */}
                    <Route path={ROUTES.HR.EMPLOYEES} element={<EmployeesPage />} />
                    <Route path={ROUTES.HR.DEPARTMENTS} element={<DepartmentsPage />} />
                    <Route path={ROUTES.HR.DESIGNATION} element={<DesignationPage />} />
                    <Route path={ROUTES.HR.ROLES} element={<RolesPage />} />
                    <Route path={ROUTES.HR.USER_ROLES} element={<UserRolesPage />} />

                    {/* 4. Products Module */}
                    <Route path={ROUTES.PRODUCTS.ROOT} element={<ProductsPage />} />

                    {/* 5. Inventory Module */}
                    <Route path={ROUTES.INVENTORY.SUPPLIERS} element={<SuppliersPage />} />
                    <Route path={ROUTES.INVENTORY.CUSTOMERS} element={<CustomersPage />} />
                    <Route path={ROUTES.INVENTORY.INVOICES} element={<InvoicesPage />} />

                    {/* 6. Stock Management Module */}
                    <Route path={ROUTES.STOCK_MANAGEMENT.PURCHASE} element={<PurchasesPage />} />
                    <Route
                        path={ROUTES.STOCK_MANAGEMENT.STOCK_SUMMARY}
                        element={<StockSummaryPage />}
                    />

                    {/* 7. Accounts Module */}
                    <Route path={ROUTES.ACCOUNTS.EXPENSES} element={<ExpensesPage />} />
                    <Route path={ROUTES.ACCOUNTS.SALARY} element={<SalaryPage />} />
                    <Route
                        path={ROUTES.ACCOUNTS.SUPPLIER_PAYMENT}
                        element={<SupplierPaymentPage />}
                    />
                    <Route
                        path={ROUTES.ACCOUNTS.CUSTOMER_DUE_COLLECTION}
                        element={<CustomerDueCollectionPage />}
                    />
                    <Route
                        path={ROUTES.ACCOUNTS.COMMISSION_PROFIT}
                        element={<CommissionProfitPage />}
                    />

                    {/* 8. Reports Module */}
                    <Route path={ROUTES.REPORTS.ROOT} element={<ReportsPage />} />
                    <Route
                        path={ROUTES.REPORTS.DAILY_SALES}
                        element={<DailySalesReportPage />}
                    />
                    <Route
                        path={ROUTES.REPORTS.DAILY_PURCHASE}
                        element={<DailyPurchaseReportPage />}
                    />
                    <Route
                        path={ROUTES.REPORTS.STOCK_SUMMARY}
                        element={<StockSummaryReportPage />}
                    />
                    <Route
                        path={ROUTES.REPORTS.CUSTOMER_DUE}
                        element={<CustomerDueReportPage />}
                    />
                    <Route
                        path={ROUTES.REPORTS.SUPPLIER_DUE}
                        element={<SupplierDueReportPage />}
                    />
                    <Route
                        path={ROUTES.REPORTS.DAILY_EXPENSE}
                        element={<DailyExpenseReportPage />}
                    />
                    <Route
                        path={ROUTES.REPORTS.GROSS_PROFIT}
                        element={<GrossProfitReportPage />}
                    />
                    <Route
                        path={ROUTES.REPORTS.CASH_FLOW}
                        element={<CashFlowReportPage />}
                    />
                    <Route
                        path={ROUTES.REPORTS.PRODUCT_LEDGER}
                        element={<ProductLedgerReportPage />}
                    />
                    <Route
                        path={ROUTES.REPORTS.COLLECTION}
                        element={<CollectionReportPage />}
                    />
                </Route>

                {/* Catch-all 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export * from './paths';
export * from './types';
export * from './NotFoundPage';
