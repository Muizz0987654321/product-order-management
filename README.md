# Product Order Management (Vite + React + TypeScript)

Small admin demo app for managing products and generating dummy orders.

## Quick summary
- Frontend: Vite + React + TypeScript
- UI: Material UI v5 + MUI DataGrid
- State: Redux Toolkit (slices + createAsyncThunk)
- Services: thin network & utility helpers in `src/services`
- Local persistence: lightweight fallback using `localStorage` keys

## Repo structure (important files)
- `src/main.tsx` — app entry, wraps `App` with Redux Provider
- `src/App.tsx` — layout and router
- `src/pages/` — page components
  - `products/Products.tsx` — product list, filters, DataGrid
  - `products/CreateUpdate.tsx` — create / update product form
  - `orders/Orders.tsx` — generate and view dummy orders
  - `dashboard/Dashboard.tsx` — simple overview page
- `src/components/` — reusable UI components (FilterPanel, ConfirmationDialog, OrderStatusBadge, ProductCard)
- `src/features/` — Redux slices
  - `products/productsSlice.ts` — fetch/create/update/delete thunks and selectors
  - `orders/ordersSlice.ts` — load/generate/clear orders
  - `ui/uiSlice.ts` — drawer/toast state
- `src/services/` — network + helpers
  - `productService.ts` — DummyJSON wrapper
  - `orderService.ts` — order generator + helpers
- `src/types/index.ts` — shared TypeScript types
- `tsconfig.app.json` & `vite.config.ts` — path aliases configured (`@components`, `@features`, `@store`, `@services`, `@types`)

## Local persistence keys
- `localProducts_v1` — locally created/edited products
- `localOrders_v1` — generated orders

## How it works (high-level flows)
- Products: app fetches server list (DummyJSON) and merges local products saved in `localProducts_v1`. Local items are marked `source: "local"` and are editable/deletable.
- Create/Update: creating an item writes a local product (`local-<timestamp>`). Editing a server product calls the API then saves a local copy `local-<serverId>` so changes persist.
- Orders: user can generate N fake orders sampled from available products (uses `generateFakeOrders` in `src/services/orderService.ts`). Generated orders are saved to `localOrders_v1` and loaded into the `orders` Redux slice.

## Common commands
All commands use `pnpm` (project uses pnpm lockfile).

Start dev server
```powershell
pnpm dev
```

Build production
```powershell
pnpm build
```

Preview built site
```powershell
pnpm preview
```

Install dependencies
```powershell
pnpm install
```

Run Storybook (not configured by default here — see notes)
```powershell
# if you install storybook and addons
pnpm storybook
```

## Notes for contributors
- Thunks: all async workflows live in `src/features/*Slice.ts` and should use services in `src/services` for network or independent logic.
- Services: keep business logic (order generation, parsing) and HTTP wrappers in `src/services` so slices and components stay focused on orchestration and UI.
- Aliases: TypeScript path aliases are defined in `tsconfig.app.json` and mirrored in `vite.config.ts`. Use `@features/...`, `@components/...`, `@services/...`, `@types` for imports.

## Recommended small improvements (ideas)
- Add confirmation before clearing orders in `Orders.tsx`.
- Disable “Generate Orders” button when no products are available.
- Add unit tests for `generateFakeOrders` and thunks (Jest + RTL).
- Optionally install and configure Storybook to use the `.stories.tsx` files.

## Troubleshooting
- If TypeScript cannot resolve aliases in your editor, restart the TS server or IDE.
- If story files produce build errors, either install Storybook dev deps or exclude `*.stories.*` from the TS project (done here in `tsconfig.app.json`).

## Where to change behavior
- Change order generation logic: `src/services/orderService.ts`.
- Change product persistence key or merging behavior: `src/features/products/productsSlice.ts`.
- Change orders persistence: `src/features/orders/ordersSlice.ts` (uses `localOrders_v1`).

---
If you want, I can also:
- Add a short `CONTRIBUTING.md` with dev setup steps,
- Add a `Makefile` or `pnpm` scripts to automate common checks, or
- Create quick unit tests for core functions.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
