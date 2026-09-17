/**
 * Centralized Route Paths definition for Emojud ERP
 * Matches backend feature routes & modules structure.
 */
export const ROUTES = {
    ROOT: '/',
    AUTH: {
        LOGIN: '/login'
    },
    FEATURE_ROOT: '/feature',
    HOME: {
        DASHBOARD: '/feature/dashboard'
    },
    CONFIGURATIONS: {
        SHOPS: '/feature/shops',
        WAREHOUSE: '/feature/warehouse',
        PRODUCT_CATEGORY: '/feature/product-category',
        USER_SHOP_PERMISSION: '/feature/user-shop-permission'
    },
    HR: {
        EMPLOYEES: '/feature/employees',
        DEPARTMENTS: '/feature/departments',
        DESIGNATION: '/feature/designation',
        ROLES: '/feature/roles',
        USER_ROLES: '/feature/user-roles'
    },
    PRODUCTS: {
        ROOT: '/feature/products'
    },
    INVENTORY: {
        SUPPLIERS: '/feature/suppliers',
        CUSTOMERS: '/feature/customers',
        INVOICES: '/feature/invoices'
    },
    STOCK_MANAGEMENT: {
        PURCHASE: '/feature/purchases',
        STOCK_SUMMARY: '/feature/stock-summary'
    },
    ACCOUNTS: {
        EXPENSES: '/feature/expenses',
        SALARY: '/feature/salary',
        SUPPLIER_PAYMENT: '/feature/supplier-payment',
        CUSTOMER_DUE_COLLECTION: '/feature/customer-due-collection',
        COMMISSION_PROFIT: '/feature/commission-profit'
    },
    REPORTS: {
        ROOT: '/feature/reports',
        DAILY_SALES: '/feature/reports/daily-sales',
        DAILY_PURCHASE: '/feature/reports/daily-purchase',
        STOCK_SUMMARY: '/feature/reports/stock-summary',
        CUSTOMER_DUE: '/feature/reports/customer-due',
        SUPPLIER_DUE: '/feature/reports/supplier-due',
        DAILY_EXPENSE: '/feature/reports/daily-expense',
        GROSS_PROFIT: '/feature/reports/gross-profit',
        CASH_FLOW: '/feature/reports/cash-flow',
        PRODUCT_LEDGER: '/feature/reports/product-ledger',
        COLLECTION: '/feature/reports/collection'
    }
} as const;
