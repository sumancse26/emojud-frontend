<p align="center">
  <img src="public/favicon.svg" alt="Emojud Logo" width="80" height="80" />
</p>

<h1 align="center">Emojud</h1>

<p align="center">
  <strong>Sales & Inventory Management System — Frontend</strong>
</p>

<p align="center">
  A modern, enterprise-grade ERP frontend for managing sales, inventory, human resources, and financial operations — built with React 19, TypeScript, and Vite.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-Private-red" alt="License" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Modules](#modules)
- [Shared Component Library](#shared-component-library)
- [API Layer](#api-layer)
- [Theming](#theming)
- [Contributing](#contributing)

---

## Overview

**Emojud** is a comprehensive Sales & Inventory Management System designed for businesses that manage multi-branch operations, product catalogs, purchase workflows, customer/supplier relationships, and financial accounting. This repository contains the **frontend** application — a single-page application (SPA) that communicates with a RESTful backend API.

---

## Key Features

| Category | Highlights |
|---|---|
| **Dashboard** | Revenue charts, stats grid, low-stock alerts, recent invoices/purchases, top products, payment method breakdown |
| **Configurations** | Multi-shop setup, warehouse management, product categories, user-shop permission mapping |
| **Human Resources** | Employee directory, departments, designations, roles & user-role assignments |
| **Products** | Full product catalog management with category associations |
| **Inventory** | Supplier & customer registries, invoice generation and tracking |
| **Stock Management** | Purchase order workflows, stock summary & ledger views |
| **Accounts** | Expense tracking, salary management, supplier payments, customer due collections, commission/profit tracking |
| **Reports** | Daily sales, daily purchases, stock summary, customer/supplier dues, daily expenses, gross profit, cash flow, product ledger, collection reports |
| **Auth & Security** | JWT-based authentication, protected routes, automatic token refresh handling, 401 redirect |
| **UX** | Dark/Light theme toggle, collapsible sidebar, responsive mobile layout, toast notifications, skeleton loaders |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev) with functional components & hooks |
| **Language** | [TypeScript 6](https://www.typescriptlang.org) — strict type-checked codebase |
| **Build Tool** | [Vite 8](https://vite.dev) — lightning-fast HMR & optimized builds |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite` plugin |
| **Routing** | [React Router 7](https://reactrouter.com) — declarative, nested routes |
| **HTTP Client** | [Axios](https://axios-http.com) — interceptors, caching, token management |
| **Charts** | [Chart.js](https://www.chartjs.org) — revenue & analytics visualizations |
| **Icons** | [Lucide React](https://lucide.dev) — consistent SVG icon library |
| **Utilities** | [clsx](https://github.com/lukeed/clsx) — conditional class composition |
| **Fonts** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) |
| **Linting** | [ESLint 10](https://eslint.org) with `react-hooks` & `react-refresh` plugins |

---

## Architecture

The application follows a **feature-based modular architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                    main.tsx                          │
│              (BrowserRouter + App)                   │
├─────────────────────────────────────────────────────┤
│                  AppProvider                         │
│       (Theme, Sidebar, Branch — Context API)         │
├─────────────────────────────────────────────────────┤
│                  ToastProvider                       │
│            (Global notification system)              │
├─────────────────────────────────────────────────────┤
│                   AppRouter                          │
│    ┌───────────┐    ┌──────────────────────┐        │
│    │  Public    │    │  Protected Routes    │        │
│    │  /login    │    │  /feature/*          │        │
│    └───────────┘    │  ┌────────────────┐  │        │
│                      │  │  MainLayout    │  │        │
│                      │  │  ┌──────────┐  │  │        │
│                      │  │  │ Sidebar  │  │  │        │
│                      │  │  │ Header   │  │  │        │
│                      │  │  │ <Outlet> │  │  │        │
│                      │  │  └──────────┘  │  │        │
│                      │  └────────────────┘  │        │
│                      └──────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

Each feature module encapsulates its own:
- `pages/` — Route-level page components  
- `components/` — UI building blocks  
- `hooks/` — Data-fetching & business logic hooks  
- `services/` — API endpoint definitions  
- `types/` — TypeScript interfaces & type guards  

---

## Project Structure

```
emojud-frontend/
├── public/                          # Static assets (favicon, sprite icons)
├── src/
│   ├── app/
│   │   ├── App.tsx                  # Root component
│   │   ├── modules/                 # Feature modules
│   │   │   ├── auth/                #   Authentication (login)
│   │   │   ├── dashboard/           #   Dashboard & analytics
│   │   │   ├── configurations/      #   Shops, warehouses, categories, permissions
│   │   │   ├── hr/                  #   Employees, departments, roles
│   │   │   ├── products/            #   Product catalog management
│   │   │   ├── inventory/           #   Suppliers, customers, invoices
│   │   │   ├── stock-management/    #   Purchases & stock tracking
│   │   │   ├── accounts/            #   Expenses, salary, payments
│   │   │   └── reports/             #   All reporting pages
│   │   ├── providers/               # React Context providers (theme, sidebar)
│   │   └── routes/                  # Centralized route definitions & guards
│   ├── assets/                      # Images & SVGs
│   ├── config/                      # Environment & navigation menu config
│   ├── hooks/                       # Domain-specific custom hooks
│   ├── layouts/
│   │   └── MainLayout/              # Sidebar + Header + Content layout
│   ├── services/                    # Domain-level API service wrappers
│   ├── shared/
│   │   ├── components/              # Reusable UI component library
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Dropdown/
│   │   │   ├── FormField/
│   │   │   ├── PageHeader/
│   │   │   ├── Pagination/
│   │   │   ├── ShopDropdown/
│   │   │   ├── Skeleton/
│   │   │   ├── SliderDrawer/
│   │   │   └── Toast/
│   │   ├── constants/               # App-wide constants
│   │   ├── hooks/                   # Generic reusable hooks (useApi, useLocalStorage, useTablePagination)
│   │   ├── services/                # API client & token storage
│   │   ├── types/                   # Common TypeScript types
│   │   └── utils/                   # Formatter utilities
│   └── styles/
│       ├── global.css               # Global styles & Tailwind directives
│       └── variables.css            # CSS custom properties / design tokens
├── index.html                       # HTML entry point
├── vite.config.ts                   # Vite configuration with path aliases
├── tsconfig.json                    # TypeScript project references
├── tsconfig.app.json                # App-specific TS config
├── tsconfig.node.json               # Node/Vite TS config
├── eslint.config.js                 # ESLint configuration
├── package.json
└── .env.development                 # Development environment variables
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or compatible package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/sumancse26/emojud-frontend.git
cd emojud-frontend

# Install dependencies
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** by default.

### Build for Production

```bash
npm run build
```

The optimized output is generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## Environment Variables

Create a `.env.development` (or `.env.production`) file in the project root:

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `localhost:3000` |

```env
VITE_API_URL="localhost:3000"
```

> **Note:** The app automatically prepends `http://` if no protocol is provided and strips trailing slashes.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check with `tsc` then build for production |
| `npm run lint` | Run ESLint across the entire codebase |
| `npm run preview` | Preview the production build locally |

---

## Modules

### 🔐 Authentication
JWT-based login flow with secure token storage. Protected routes automatically redirect unauthenticated users. Supports automatic 401 handling with session cleanup.

### 📊 Dashboard
Rich analytics dashboard featuring revenue charts (Chart.js), KPI stats grid, low-stock alerts, recent invoices table, recent purchases table, top-selling products, and payment method breakdown widgets — each wrapped in its own error boundary.

### ⚙️ Configurations
Multi-branch shop management, warehouse setup, product category hierarchy, and granular user-shop permission assignments.

### 👥 Human Resources
Employee directory with department and designation management. Role-based access control with user-role mapping capabilities.

### 📦 Products
Complete product catalog management with category associations, search, filtering, and paginated views.

### 🧾 Inventory
Supplier and customer registries with full CRUD operations. Invoice generation, tracking, and management workflows.

### 📋 Stock Management
Purchase order creation and tracking. Stock summary views for real-time inventory visibility across warehouses.

### 💰 Accounts
Financial operations including expense tracking, salary management, supplier payment processing, customer due collection, and commission/profit analysis.

### 📈 Reports
Comprehensive reporting suite with 10 report types:
- Daily Sales & Purchase Reports
- Stock Summary Report
- Customer & Supplier Due Reports
- Daily Expense Report
- Gross Profit Report
- Cash Flow / Cash Book Report
- Product Ledger Report
- Collection Report

---

## Shared Component Library

The `src/shared/components/` directory provides a consistent, reusable UI library:

| Component | Purpose |
|---|---|
| **Button** | Primary, secondary, and icon button variants |
| **Card** | Content container with consistent styling |
| **Dropdown** | Accessible dropdown menu with keyboard navigation |
| **FormField** | Labeled input wrapper with validation support |
| **PageHeader** | Standardized page title + breadcrumb + actions bar |
| **Pagination** | Table pagination with page size controls |
| **ShopDropdown** | Branch/shop selector integrated with app context |
| **Skeleton** | Loading placeholder with shimmer animation |
| **SliderDrawer** | Slide-in panel for forms & detail views |
| **Toast** | Global notification system (success, error, info, warning) |

---

## API Layer

The HTTP client (`src/shared/services/apiClient.ts`) is built on top of Axios and provides:

- **Automatic Bearer token injection** via request interceptors
- **GET response caching** with a 30-minute TTL and automatic cache invalidation on mutations
- **Request deduplication** — simultaneous identical GET requests share the same promise
- **401 handling** — automatic session cleanup and redirect to login
- **Cache-busting** on POST/PUT/PATCH/DELETE operations

Custom hooks (`useApi`) abstract data fetching with loading states, error handling, and typed responses.

---

## Theming

Emojud supports **Light** and **Dark** themes with seamless toggling:

- Theme preference persists in `localStorage`
- Falls back to system preference (`prefers-color-scheme`) on first visit
- CSS custom properties defined in `src/styles/variables.css`
- Tailwind's `dark:` variant classes used throughout components
- Smooth `200ms` color transition on theme switch

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

Please follow the existing module structure and naming conventions when adding new features.

---

<p align="center">
  Built with ❤️ by the Emojud Team
</p>
