# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript type-check + Vite production build
- `npm run lint` — ESLint
- `npm run preview` — Preview production build locally

## Tech Stack

- React 19 + TypeScript 6 + Vite 8
- Tailwind CSS 4 (via @tailwindcss/vite plugin)
- shadcn/ui (Radix Nova preset) with Lucide React icons
- React Router DOM 7 (createBrowserRouter)
- TanStack Query (@tanstack/react-query) for server state
- Axios for HTTP, with a wrapped `request` client
- Toasts via `sonner`; top progress bar via `nprogress`
- Class utilities: clsx + tailwind-merge via `cn()` helper in `src/lib/utils.ts`
- Component variants: class-variance-authority (CVA)

## Architecture

- **Entry**: `main.tsx` → `App.tsx`. `App.tsx` wraps the app in `QueryClientProvider` (global `QueryClient` config: `staleTime: Infinity`, no refetch on focus/reconnect, `retry: 1`) and renders `<RouterProvider>` + the `<Toaster>`.
- **Routing**: `src/router/index.tsx` — `createBrowserRouter`. All routes nest under `MainLayout` (`src/layouts/MainLayout.tsx`): `/` → Home, `/accounting` → Accounting, `/books` → Books, `/user` → Mine.
- **Pages**: `src/pages/` — page-level components mapped by router.
- **UI Components**: `src/components/ui/` — shadcn/ui components (added via `npx shadcn@latest add`). App-level components (e.g. `LoginDialog`) live directly in `src/components/`.
- **Utilities**: `src/lib/utils.ts` — shared helpers (`cn()` for className merging).

## API Layer (`src/api/`)

- **`request.ts`** — the single Axios instance and `request` wrapper (`get/post/put/delete/patch`). Key behavior:
  - `baseURL` = `import.meta.env.VITE_API_BASE_URL ?? '/api'`; `withCredentials: true` so the http-only refresh cookie is sent/received.
  - Request interceptor attaches `Authorization: Bearer <access_token>` (from localStorage) and drives the NProgress bar.
  - Response interceptor unwraps the backend envelope `{ code, message, data }`: on `code === 200` it returns **`data` directly** (so callers get the payload, not the Axios response); otherwise it toasts `message` and rejects.
  - **Auto-refresh on 401**: a single shared `refreshPromise` mutex calls `performRefresh()` (cookie-based POST `/auth/refresh`, no body), stores the new access token, and replays the original request. Pass `skipAuthRefresh: true` in the request config to opt out (used by login/register/refresh/logout). Refresh failure → `clearAuth()` + "session expired" toast.
- **`modules/`** — endpoint functions grouped by domain (`user.ts`, `accounting.ts`, `book.ts`), called from components via TanStack Query.
- **`types/`** — request/response types; `index.ts` re-exports each domain file, so import from `@/api/types`.

## Auth

- **`src/lib/auth.ts`** — access token only, stored in `localStorage`. `setAccessToken` / `clearAuth` both fire a custom `AUTH_EVENT` on `window`. The **refresh token is an http-only cookie** managed entirely by the browser/backend — never read, stored, or sent manually by the frontend.
- **`src/hooks/useAuth.ts`** — `useAuth()` mirrors the token into React state, re-syncing on `AUTH_EVENT` (same tab) and the native `storage` event (cross-tab). Returns `{ isLoggedIn, logout }`.
- Login/logout UI: `src/components/LoginDialog.tsx` and `src/pages/mine.tsx`.

## Styling

- Tailwind utility-first with CSS custom properties for theming (oklch color system)
- Light/dark mode via CSS variables defined in `src/index.css`
- shadcn config in `components.json` (radix-nova style, CSS variables enabled)

## Path Aliases

`@/*` maps to `./src/*` — configured in both `tsconfig.json`/`tsconfig.app.json` and `vite.config.ts`.
