# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev        # Start dev server (uses Turbopack)
bun build      # Production build
bun lint       # ESLint
```

There are no tests configured. Use `bun` — not `npm`/`yarn`/`pnpm` — for all package management and script execution.

## Architecture

**arq-manager** is a Next.js 16 + React 19 project management dashboard for an architecture/construction firm. The UI is built with shadcn/ui (new-york style, Tailwind CSS v4), and the app is entirely in Spanish.

### Route structure

```
app/
  page.tsx                        → root landing (Header + placeholder)
  layout.tsx                      → root layout (ThemeProvider, Geist fonts)
  login/                          → login page
  dashboard/
    layout.tsx                    → wraps all dashboard routes with AppSidebar + SidebarInset
    page.tsx                      → re-exports app/home/page
    home/page.tsx                 → dashboard home
    direccion/proyectos/          → Dirección role: projects
    auxadmin/
      proyectos/ recibos/ usuarios/ vacaciones-usuarios/
    obra/proyectos/
    arquitectura/proyectos/
```

### Component organization

- `components/ui/` — shadcn/ui primitives (do not modify unless updating a shadcn component)
- `components/` root — layout shell components: `AppSidebar`, `Header`, `NavMain`, `NavUser`, `TeamSwitcher`, `LoginForm`, `SignupForm`, `ThemeProvider`, `ModeToggle`
- `components/projects/` — `ProjectsPage` (shared across roles via `area` prop), `NewProject`
- `components/recibos/` — `RecibosPage`, `NewRecibo` (generates PDF receipts via `lib/pdf-generator.ts`)
- `components/tasks/` — Kanban board with drag-and-drop (`@dnd-kit/react`); columns: assigned/received/completed; types in `task-types.ts`, seed data in `task-data.ts`
- `components/users/` — `UsersPage`
- `components/notes/` — `Notes`, `NewNote`
- `components/vacaciones/` — `VacacionesPage` (vacation request approval with interactive calendar)

### Key patterns

**Role-based area prop**: `ProjectsPage` accepts `area: "auxadmin" | "obra" | "arquitectura"` and renders role-specific title/description from a config map. This is the established pattern for shared pages across roles.

**Mock data**: All data is currently hardcoded in component files (no backend/API). When adding features, follow the existing pattern of declaring mock arrays outside the component to avoid re-creation on render.

**PDF generation**: `lib/pdf-generator.ts` exports `generarReciboPDF(data: ReciboData, download: boolean)`. Pass `false` to preview in a new tab, `true` to download.

**Form handling**: `react-hook-form` + `@hookform/resolvers` + `zod` for form validation.

**Styling**: Use `cn()` from `@/lib/utils` (clsx + tailwind-merge) for conditional classes. Theme uses CSS variables via shadcn. Dark mode is supported throughout.

**Path aliases**: `@/components`, `@/lib`, `@/hooks`, `@/components/ui` are all configured.

## Skills

Before working on components or UI, read the relevant skill file:

| Task | Skill |
|---|---|
| Create/edit/refactor React components | `.agents/skills/react-best-practices/SKILL.md` |
| Composition patterns, compound components | `.agents/skills/composition-patterns/SKILL.md` |
| UI review, accessibility, UX | `.agents/skills/web-design-guidelines/SKILL.md` |

- Always read the relevant skill before generating or modifying component code.
- Do **not** use boolean props for component variants — use composition patterns from the skill.
- Prefer `children` over `renderX` props.
