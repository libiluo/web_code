# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React + Vite web application using TypeScript, React Router, Tailwind CSS v4, and shadcn/ui components. The project uses the React Compiler for optimized performance and follows a modern component-based architecture.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

## Architecture

### Build System
- **Vite** as the build tool with Hot Module Replacement (HMR)
- **React Compiler** enabled via Babel plugin (`babel-plugin-react-compiler`) in Vite config
- Tailwind CSS v4 integrated via Vite plugin (`@tailwindcss/vite`)

### Routing
- Uses `react-router-dom` v7 with `BrowserRouter` setup in [src/main.tsx](src/main.tsx)
- Router wraps the entire app at the root level

### UI Components
- **shadcn/ui** components configured in [components.json](components.json)
  - Style: "new-york"
  - Uses Tailwind CSS with CSS variables
  - Components located in `src/components/ui/`
  - Icon library: `lucide-react`
- Custom utility function `cn()` in [src/lib/utils.ts](src/lib/utils.ts) combines `clsx` and `tailwind-merge` for className management

### Path Aliases
The following path aliases are configured in both [vite.config.js](vite.config.js) and [tsconfig.json](tsconfig.json):
- `@/` → `src/`
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/ui` → `src/components/ui`
- `@/hooks` → `src/hooks`

Always use these aliases for imports instead of relative paths.

### TypeScript Configuration
- Strict mode enabled with additional strictness options:
  - `noUncheckedIndexedAccess: true`
  - `exactOptionalPropertyTypes: true`
- Module system: `nodenext` targeting `esnext`
- JSX: `react-jsx` (new JSX transform)
- `verbatimModuleSyntax` and `isolatedModules` enabled for better build compatibility

### Styling
- **Tailwind CSS v4** (not v3 - note the different configuration approach)
- No separate `tailwind.config.js` - Tailwind v4 uses CSS-based configuration
- Global styles in [src/index.css](src/index.css)
- CSS variables defined for theming (neutral base color)
- Uses `tw-animate-css` for animations

### ESLint
- Flat config format using `eslint.config.js`
- Configured for `.js` and `.jsx` files only (TypeScript files may need separate handling)
- React Hooks plugin with recommended-latest rules
- React Refresh plugin for Vite
- Custom rule: allows unused variables matching `^[A-Z_]` pattern (constants/types)

## Adding shadcn/ui Components

Use the shadcn CLI to add new components:
```bash
npx shadcn@latest add [component-name]
```

Components will be automatically added to `src/components/ui/` with proper path aliases.

## Important Notes

### React Compiler
The React Compiler is enabled in this project (unlike the base Vite template). This may affect component behavior and optimization. Be aware of compiler assumptions about component purity.

### File Extensions
- Source files use `.tsx` and `.ts` extensions
- Configuration files use `.js` (not `.ts` or `.mjs`)

### Type Definitions
- Global type definitions in [src/global.d.ts](src/global.d.ts)
- React v19 types are installed
