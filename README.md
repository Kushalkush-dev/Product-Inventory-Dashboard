# Product Management Dashboard

A production-ready product and inventory management web application built with **Next.js 16 (App Router & Turbopack)**, **React 19**, **Tailwind CSS v4**, and **shadcn UI**. Integrated with the [DummyJSON API](https://dummyjson.com) and enhanced with a client-side mutation layer to support persistent full CRUD simulation, debounced live search, multi-field filtering, URL-synced pagination, and theme auto-detection.

---

## 🚀 Getting Started & Setup Steps

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: v18.18.0 or newer (v20+ recommended)
- **Package Manager**: `npm` (comes with Node), `pnpm`, or `yarn`

### 2. Clone & Install Dependencies
Navigate into the project directory and install the packages:

```bash
# Navigate to the project root
cd "Product Dashboard"

# Install project dependencies
npm install
```

### 3. Run the Development Server
Start the local development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the dashboard.

### 4. Build for Production
To check TypeScript types and compile the optimized production bundle:

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

---

## 🔑 Demo Authentication Credentials

The application includes protected dashboard routes and an authentication flow powered by DummyJSON Auth.

- **Username**: `emilys`
- **Password**: `emilyspass`
- *(Or click the **"Auto-fill"** button on the `/login` screen)*

---

## 🛠️ What Was Built & Implemented

Here is a breakdown of everything designed, built, and polished across the application:

### 1. Project Foundation & Design System
- Bootstrapped modern Next.js 16 with Turbopack, React 19, and Tailwind CSS v4.
- Established a cohesive design system using OKLCH color palettes with automatic light/dark theme switching based on the user's OS preference (`next-themes`), complete with a sleek animated toggle switch.
- Built with accessible, polished **shadcn UI** primitives (Buttons, Cards, Dialogs, Tables, Inputs, Badges, and Dropdown Menus).

### 2. Authentication & Route Protection
- Set up an Axios HTTP client with request and response interceptors configured for DummyJSON's Auth API.
- Implemented an `AuthContext` to persist sessions, tokens, and active user profiles in browser storage.
- Added a dedicated `/login` page with field validation, clean error banners, and a 1-click **"Auto-fill"** demo button.
- Protected internal dashboard routes using a `<ProtectedRoute>` component that automatically redirects unauthenticated visitors to `/login`.

### 3. Product Catalog & Smart Navigation
- Built an interactive product catalog showing live stock badges, category tags, price calculations, and star ratings.
- Integrated **instant debounced search** (300ms) with a custom `useDebounce` hook so queries don't spam the API while typing.
- Added dynamic category filtering and multi-field sorting (Price low/high, Highest rating, Alphabetical A-Z, and Stock levels) with an instant "Clear Filters" button.
- Synced pagination state, active search terms, and filters with the URL parameters (`?page=1&limit=10&search=...`), making every view directly shareable and bookmarkable.

### 4. Full CRUD with Persistent Client-Side Simulation
- Built dedicated **Add Product** (`/products/new`) and **Edit Product** (`/products/[id]/edit`) pages with validation for images, pricing, stock, categories, and descriptions.
- **The Challenge**: The public DummyJSON API is read-only (it mocks successful POST/PUT/DELETE responses but does not store changes on the server).
- **The Solution**: Developed a custom `ProductMutationContext` that acts as a local storage mutation layer. Any item created, updated, or deleted is tracked and merged with live API data in real-time, giving a persistent, fully functional CRUD experience across page reloads.

### 5. Product Details & Customer Reviews
- Created dynamic product pages (`/products/[id]`) with a multi-image preview gallery.
- Added comprehensive specs: SKU, dimensions, weight, warranty details, return policies, and shipping terms.
- Displayed real customer reviews with verified badges, dates, and star ratings.

### 6. Polish, UX & Homepage
- Created loading skeletons (`loading.tsx`), custom 404/error boundaries, and an interactive confirmation modal before deleting items.
- Added quick inventory summary metric cards and a fun "Random 🎲" product discover button.
- Designed a distraction-free, non-scrolling single-screen landing page with clean solid theme colors and instant pathways to both the catalog and demo login.

---

## 📂 Project Architecture

```
Product Dashboard/
├── src/
│   ├── api/                     # Axios instance & API service layer
│   │   ├── axios.ts             # Interceptors & auth token injection
│   │   ├── authApi.ts           # Login endpoint service
│   │   └── productApi.ts        # Products, categories, search, CRUD
│   ├── app/                     # Next.js App Router routes & pages
│   │   ├── layout.tsx           # ThemeProvider, AuthProvider, MutationProvider
│   │   ├── page.tsx             # Single-page landing gateway
│   │   ├── login/page.tsx       # Auth login page with demo autofill
│   │   ├── products/
│   │   │   ├── page.tsx         # Main inventory table, search, filters, pagination
│   │   │   ├── new/page.tsx     # Add product form
│   │   │   ├── [id]/page.tsx    # Detailed product view & reviews
│   │   │   └── [id]/edit/page.tsx # Edit existing product form
│   │   ├── globals.css          # Tailwind CSS v4 & OKLCH color definitions
│   │   ├── error.tsx            # Global error boundary
│   │   └── loading.tsx          # Suspense fallbacks
│   ├── components/
│   │   ├── auth/                # ProtectedRoute guard
│   │   ├── layout/              # Header, Navigation, ThemeToggle
│   │   ├── products/            # ProductTable, ProductFilters, ProductReviews
│   │   └── ui/                  # shadcn UI accessible primitives
│   ├── context/
│   │   ├── AuthContext.tsx      # User authentication & token state
│   │   └── ProductMutationContext.tsx # Client-side persistence for CRUD
│   ├── hooks/
│   │   └── useDebounce.ts       # Debounced search input hook
│   ├── lib/
│   │   └── utils.ts             # Class merging helper (cn)
│   └── types/
│       ├── auth.ts              # User & credentials types
│       └── product.ts           # Product, reviews, and query types
├── public/                      # Static assets
├── package.json                 # Dependencies & scripts
└── tsconfig.json                # TypeScript configuration
```

---

## 🧪 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server with Turbopack on `http://localhost:3000` |
| `npm run build` | Compiles application and checks TypeScript types for production |
| `npm run start` | Launches production server after build |
| `npm run lint` | Runs ESLint analysis |
