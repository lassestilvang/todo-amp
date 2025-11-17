# AGENTS.md

## Build & Test Commands

- **Dev**: `bun run dev` (starts on http://localhost:3000)
- **Build**: `bun run build`
- **Start**: `bun run start`
- **Lint**: `eslint`
- **Test**: `bun test` (tests in /test directory)
- **Single test**: `bun test test/store.test.ts` or `bun test --testNamePattern "test name"`

## Architecture & Structure

**Stack**: Next.js 15 (App Router), TypeScript, Zustand (state), SQLite (better-sqlite3), Tailwind CSS v4, shadcn/ui components

**Key directories**:
- `app/api/` - API endpoints (lists, tasks, subtasks, labels)
- `components/` - React components (sidebar, task-list, task-item, dialogs, ui/)
- `lib/db.ts` - SQLite schema & initialization
- `lib/store.ts` - Zustand store (all state management)
- `data/` - SQLite database file

**Database**: SQLite tables: lists, tasks, subtasks, labels, task_labels, task_logs, reminders, attachments, task_recurrence

**State**: Single Zustand store managing tasks, lists, subtasks, labels, UI state (views, search)

## Code Style & Conventions

- **TypeScript**: Strict mode enabled, `@/*` path alias for imports
- **Imports**: ESM with path aliases (`@/lib/*`, `@/components/*`)
- **Components**: React functional components with TypeScript, shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS with `cn()` utility from `clsx` + `tailwind-merge`
- **Naming**: PascalCase components, camelCase functions/variables
- **State updates**: Optimistic UI (update state first, sync to API)
- **Error handling**: Toast notifications via `react-hot-toast`
- **Linting**: ESLint with Next.js/TypeScript config (ignores: node_modules, .next, next-env.d.ts)
- **Testing**: Bun test with `describe/it/expect`, store tests reset state in beforeEach
- **Formatting**: Tailwind CSS v4 with PostCSS, dark mode via system preference
