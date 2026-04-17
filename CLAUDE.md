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
- Class utilities: clsx + tailwind-merge via `cn()` helper in `src/lib/utils.ts`
- Component variants: class-variance-authority (CVA)

## Architecture

- **Entry**: `main.tsx` → `App.tsx` renders the router
- **Routing**: `src/router/index.tsx` — explicit route config using createBrowserRouter, currently single route "/" → Home
- **Pages**: `src/pages/` — page-level components mapped by router
- **UI Components**: `src/components/ui/` — shadcn/ui components (added via `npx shadcn@latest add`)
- **Utilities**: `src/lib/utils.ts` — shared helpers (`cn()` for className merging)

## Styling

- Tailwind utility-first with CSS custom properties for theming (oklch color system)
- Light/dark mode via CSS variables defined in `src/index.css`
- shadcn config in `components.json` (radix-nova style, CSS variables enabled)

## Path Aliases

`@/*` maps to `./src/*` — configured in both `tsconfig.json`/`tsconfig.app.json` and `vite.config.ts`.
