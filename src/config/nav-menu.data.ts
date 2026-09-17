import type { NavMenuItem } from '@/app/routes/types';

export const NAV_MENU_DATA: NavMenuItem[] = [
    {
        id: '1',
        feature_name: 'HOME',
        module_name: 'HOME',
        route_url: '/feature/dashboard',
        parent: null,
        feature_icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>`,
        children: []
    },
    {
        id: '2',
        feature_name: 'CONFIGURATIONS',
        module_name: 'CONFIGURATIONS',
        route_url: null,
        parent: null,
        feature_icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9l1-5h16l1 5M3 9h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" />
    <path d="M9 21V12h6v9" />
  </svg>`,
        children: [
            {
                id: '201',
                feature_name: 'SHOP',
                module_name: 'SHOP',
                route_url: '/feature/shops',
                parent: '2',
                feature_icon: null
            },
            {
                id: '202',
                feature_name: 'WAREHOUSE',
                module_name: 'WAREHOUSE',
                route_url: '/feature/warehouse',
                parent: '2',
                feature_icon: null
            },
            {
                id: '203',
                feature_name: 'PRODUCT CATEGORY/SUBCATEGORY',
                module_name: 'PRODUCT CATEGORY/SUBCATEGORY',
                route_url: '/feature/product-category',
                parent: '2',
                feature_icon: null
            },
            {
                id: '204',
                feature_name: 'USER SHOP PERMISSION',
                module_name: 'USER SHOP PERMISSION',
                route_url: '/feature/user-shop-permission',
                parent: '2',
                feature_icon: null
            }
        ]
    },
    {
        id: '3',
        feature_name: 'HR',
        module_name: 'HR',
        route_url: null,
        parent: null,
        feature_icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>`,
        children: [
            {
                id: '301',
                feature_name: 'EMPLOYEE',
                module_name: 'EMPLOYEE',
                route_url: '/feature/employees',
                parent: '3',
                feature_icon: null
            },
            {
                id: '302',
                feature_name: 'DEPARTMENTS',
                module_name: 'DEPARTMENTS',
                route_url: '/feature/departments',
                parent: '3',
                feature_icon: null
            },
            {
                id: '303',
                feature_name: 'DESIGNATIONS',
                module_name: 'DESIGNATIONS',
                route_url: '/feature/designation',
                parent: '3',
                feature_icon: null
            },
            {
                id: '304',
                feature_name: 'ROLES',
                module_name: 'ROLES',
                route_url: '/feature/roles',
                parent: '3',
                feature_icon: null
            },
            {
                id: '305',
                feature_name: 'USER ROLES',
                module_name: 'USER ROLES',
                route_url: '/feature/user-roles',
                parent: '3',
                feature_icon: null
            }
        ]
    },
    {
        id: '4',
        feature_name: 'PRODUCTS',
        module_name: 'PRODUCTS',
        route_url: '/feature/products',
        parent: null,
        feature_icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>`,
        children: []
    },
    {
        id: '5',
        feature_name: 'INVENTORY',
        module_name: 'INVENTORY',
        route_url: null,
        parent: null,
        feature_icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>`,
        children: [
            {
                id: '501',
                feature_name: 'SUPPLIERS',
                module_name: 'SUPPLIERS',
                route_url: '/feature/suppliers',
                parent: '5',
                feature_icon: null
            },
            {
                id: '503',
                feature_name: 'CUSTOMERS',
                module_name: 'CUSTOMERS',
                route_url: '/feature/customers',
                parent: '5',
                feature_icon: null
            },
            {
                id: '504',
                feature_name: 'INVOICES',
                module_name: 'INVOICES',
                route_url: '/feature/invoices',
                parent: '5',
                feature_icon: null
            }
        ]
    },
    {
        id: '6',
        feature_name: 'STOCK MANAGEMENT',
        module_name: 'STOCK MANAGEMENT',
        route_url: null,
        parent: null,
        feature_icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.94-1.42L23 6H6" />
  </svg>`,
        children: [
            {
                id: '601',
                feature_name: 'PURCHASE',
                module_name: 'PURCHASE',
                route_url: '/feature/purchases',
                parent: '6',
                feature_icon: null
            },
            {
                id: '602',
                feature_name: 'STOCK SUMMARY',
                module_name: 'STOCK SUMMARY',
                route_url: '/feature/stock-summary',
                parent: '6',
                feature_icon: null
            }
        ]
    },
    {
        id: '7',
        feature_name: 'ACCOUNTS',
        module_name: 'ACCOUNTS',
        route_url: null,
        parent: null,
        feature_icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>`,
        children: [
            {
                id: '701',
                feature_name: 'EXPENSES',
                module_name: 'EXPENSES',
                route_url: '/feature/expenses',
                parent: '7',
                feature_icon: null
            },
            {
                id: '702',
                feature_name: 'SALARY',
                module_name: 'SALARY',
                route_url: '/feature/salary',
                parent: '7',
                feature_icon: null
            },
            {
                id: '703',
                feature_name: 'SUPPLIER PAYMENT',
                module_name: 'SUPPLIER PAYMENT',
                route_url: '/feature/supplier-payment',
                parent: '7',
                feature_icon: null
            },
            {
                id: '704',
                feature_name: 'CUSTOMER DUE COLLECTION',
                module_name: 'CUSTOMER DUE COLLECTION',
                route_url: '/feature/customer-due-collection',
                parent: '7',
                feature_icon: null
            },
            {
                id: '705',
                feature_name: 'COMMISSION PROFIT',
                module_name: 'COMMISSION PROFIT',
                route_url: '/feature/commission-profit',
                parent: '7',
                feature_icon: null
            }
        ]
    },
    {
        id: '8',
        feature_name: 'REPORTS',
        module_name: 'REPORTS',
        route_url: null,
        parent: null,
        feature_icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>`,
        children: [
            {
                id: '801',
                feature_name: 'DAILY SALES REPORT',
                module_name: 'DAILY SALES REPORT',
                route_url: '/feature/reports/daily-sales',
                parent: '8',
                feature_icon: null
            },
            {
                id: '802',
                feature_name: 'DAILY PURCHASE REPORT',
                module_name: 'DAILY PURCHASE REPORT',
                route_url: '/feature/reports/daily-purchase',
                parent: '8',
                feature_icon: null
            },
            {
                id: '804',
                feature_name: 'STOCK SUMMARY REPORT',
                module_name: 'STOCK SUMMARY REPORT',
                route_url: '/feature/reports/stock-summary',
                parent: '8',
                feature_icon: null
            },
            {
                id: '805',
                feature_name: 'CUSTOMER DUE REPORT',
                module_name: 'CUSTOMER DUE REPORT',
                route_url: '/feature/reports/customer-due',
                parent: '8',
                feature_icon: null
            },
            {
                id: '806',
                feature_name: 'SUPPLIER DUE REPORT',
                module_name: 'SUPPLIER DUE REPORT',
                route_url: '/feature/reports/supplier-due',
                parent: '8',
                feature_icon: null
            },
            {
                id: '807',
                feature_name: 'DAILY EXPENSE REPORT',
                module_name: 'DAILY EXPENSE REPORT',
                route_url: '/feature/reports/daily-expense',
                parent: '8',
                feature_icon: null
            },
            {
                id: '808',
                feature_name: 'GROSS PROFIT REPORT',
                module_name: 'GROSS PROFIT REPORT',
                route_url: '/feature/reports/gross-profit',
                parent: '8',
                feature_icon: null
            },
            {
                id: '809',
                feature_name: 'CASH BOOK REPORT',
                module_name: 'CASH BOOK REPORT',
                route_url: '/feature/reports/cash-flow',
                parent: '8',
                feature_icon: null
            },
            {
                id: '810',
                feature_name: 'PRODUCT LEDGER REPORT',
                module_name: 'PRODUCT LEDGER REPORT',
                route_url: '/feature/reports/product-ledger',
                parent: '8',
                feature_icon: null
            },
            {
                id: '811',
                feature_name: 'COLLECTION REPORT',
                module_name: 'COLLECTION REPORT',
                route_url: '/feature/reports/collection',
                parent: '8',
                feature_icon: null
            }
        ]
    }
];
