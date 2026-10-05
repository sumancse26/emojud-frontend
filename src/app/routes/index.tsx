import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { MainLayout } from '@/layouts';
import { ROUTES } from './paths';
import { NotFoundPage } from './NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';
import {
    PageLoader,
    FeaturePlaceholder,
    LoginPage,
    DashboardPage,
    ShopsPage,
    WarehousePage,
    ProductCategoryPage,
    UserShopPermissionPage,
    EmployeesPage,
    DepartmentsPage,
    DesignationPage,
    RolesPage,
    UserRolesPage,
    ProductsPage,
    SuppliersPage,
    CustomersPage,
    InvoicesPage,
    PurchasesPage,
    StockSummaryPage,
    ExpensesPage,
    SalaryPage,
    SupplierPaymentPage,
    CustomerDueCollectionPage,
    CommissionProfitPage,
    ReportsPage,
    DailySalesReportPage,
    DailyPurchaseReportPage,
    StockSummaryReportPage,
    CustomerDueReportPage,
    SupplierDueReportPage,
    DailyExpenseReportPage,
    GrossProfitReportPage,
    CashFlowReportPage,
    ProductLedgerReportPage,
    CollectionReportPage
} from './components';

export const AppRouter: React.FC = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public Auth Routes */}
                <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />

                {/* Root Redirections */}
                <Route
                    path={ROUTES.ROOT}
                    element={<Navigate to={ROUTES.HOME.DASHBOARD} replace />}
                />
                <Route
                    path={ROUTES.FEATURE_ROOT}
                    element={<Navigate to={ROUTES.HOME.DASHBOARD} replace />}
                />

                {/* Protected Enterprise ERP Feature Routes (Nested inside ProtectedRoute + MainLayout) */}
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }>
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

                    {/* Feature Fallback within Layout for dynamic / submenu items */}
                    <Route path="/feature/*" element={<FeaturePlaceholder />} />
                </Route>

                {/* Catch-all 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export * from './paths';
export * from './types';
export * from './components';
export * from './NotFoundPage';
export * from './ProtectedRoute';
export default AppRouter;
