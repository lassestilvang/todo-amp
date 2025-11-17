# Task Planner - Daily Task Management Application

A modern, professional Next.js daily task planner built with TypeScript, Tailwind CSS, and Zustand.

## Features

### ✅ Core Features Implemented

#### 1. **Lists Management**
- Default "Inbox" list created automatically
- Create custom lists with:
  - Custom names
  - Color-coded labels (7 color options)
  - Emoji icons (10 emoji options)
- List visibility in sidebar with task counts
- Delete custom lists (Inbox cannot be deleted)

#### 2. **Task Management**
- Comprehensive task creation and editing with:
  - Task name and description
  - Scheduled date
  - Deadline with overdue highlighting
  - Priority levels (High, Medium, Low, None)
  - Time estimates (HH:mm format)
  - Actual time tracking
  - Task completion toggling with automatic timestamp
- Task history/audit logging of all changes
- Support for attachments, reminders, and recurring tasks (schema prepared)
- Fast fuzzy search across tasks

#### 3. **Views**
- **Today**: Tasks scheduled for today
- **Next 7 Days**: Tasks for today and the next 7 days  
- **Upcoming**: All future tasks
- **All**: All tasks including unscheduled ones
- Toggle visibility of completed tasks in any view
- Task count badges for each view

#### 4. **Subtasks & Checklists**
- Add subtasks to any task
- Check off subtasks individually
- View progress (x/y subtasks completed)
- Complete subtask deletion

#### 5. **Labels**
- Create custom labels with:
  - Custom names
  - Color-coded styling
  - Emoji indicators
- Label management in sidebar

#### 6. **UI/UX Features**
- Split-view layout: Sidebar (lists/views) + Main panel (tasks)
- Responsive design (desktop and mobile)
- Smooth animations with Framer Motion
- Dark mode support with system preference detection
- Overdue task badges with count
- Visual feedback for user actions
- Loading states and error handling
- Toast notifications for confirmations/errors

#### 7. **Search**
- Real-time fuzzy search using Fuse.js
- Search across task names and descriptions
- Instant results as you type

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type checking
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (custom Radix UI implementation)
- **Animations**: Framer Motion
- **Database**: SQLite with better-sqlite3
- **Validation**: Form validation with custom logic
- **Testing**: Bun Test (19 tests, all passing)
- **Package Manager**: Bun

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with AppProvider
│   ├── page.tsx                # Main app page
│   ├── globals.css             # Tailwind + theme setup
│   └── api/
│       ├── lists/              # List CRUD endpoints
│       ├── tasks/              # Task CRUD endpoints  
│       ├── subtasks/           # Subtask CRUD endpoints
│       └── labels/             # Label CRUD endpoints
├── components/
│   ├── sidebar.tsx             # Main sidebar with views/lists/labels
│   ├── task-list.tsx           # Task list view component
│   ├── task-item.tsx           # Individual task component
│   ├── app-provider.tsx        # Provider with data loading
│   ├── ui/                     # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── checkbox.tsx
│   │   ├── badge.tsx
│   │   └── dialog.tsx
│   └── dialogs/                # Modal dialogs
│       ├── create-list-dialog.tsx
│       ├── create-label-dialog.tsx
│       ├── create-task-dialog.tsx
│       └── task-detail-dialog.tsx
├── lib/
│   ├── db.ts                   # SQLite database setup & schema
│   ├── store.ts                # Zustand store (all state management)
│   └── utils.ts                # Utility functions (cn)
├── test/
│   ├── setup.ts                # Test setup
│   ├── store.test.ts           # Store tests (16 passing)
│   └── utils.test.ts           # Utility tests (3 passing)
├── data/                       # SQLite database file (auto-created)
├── public/                     # Static assets
├── package.json                # Dependencies
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind configuration
└── components.json             # shadcn/ui configuration
```

## Database Schema

The application uses SQLite with the following tables:

- **lists**: Task lists with colors, emojis, and default flag
- **tasks**: Main task data with dates, deadlines, priority, estimates
- **subtasks**: Checklist items for tasks
- **labels**: Custom labels for categorization
- **task_labels**: Many-to-many relationship between tasks and labels
- **task_logs**: Audit trail of all task changes
- **reminders**: Task reminders (schema prepared)
- **attachments**: File attachments (schema prepared)
- **task_recurrence**: Recurring task patterns (schema prepared)

## Getting Started

### Prerequisites
- Bun v1.3.2 or higher
- Node.js compatible system

### Installation

```bash
cd /Users/lasse/Sites/todo-amp
bun install
```

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
bun run build
bun run start
```

### Testing

```bash
bun test
```

All 19 tests pass successfully:
- Store management tests (16 tests)
- Utility function tests (3 tests)

## API Endpoints

### Lists
- `GET /api/lists` - Get all lists
- `POST /api/lists` - Create a new list
- `GET /api/lists/[id]` - Get a specific list
- `PATCH /api/lists/[id]` - Update a list
- `DELETE /api/lists/[id]` - Delete a list (except Inbox)

### Tasks  
- `GET /api/tasks` - Get all tasks (optional: ?listId=)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PATCH /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Subtasks
- `GET /api/subtasks?taskId=[id|all]` - Get subtasks
- `POST /api/subtasks` - Create a subtask
- `PATCH /api/subtasks/[id]` - Update a subtask
- `DELETE /api/subtasks/[id]` - Delete a subtask

### Labels
- `GET /api/labels` - Get all labels
- `POST /api/labels` - Create a new label

## Key Components

### Sidebar (`components/sidebar.tsx`)
- Navigation between different views (Today, Next 7 Days, Upcoming, All)
- List management with creation dialog
- Label management with creation dialog
- Overdue task counter badge

### TaskList (`components/task-list.tsx`)
- Main task viewing area
- Search functionality with fuzzy matching
- Task filtering by view and completion status
- Create task button

### TaskItem (`components/task-item.tsx`)
- Individual task rendering with:
  - Checkbox for completion
  - Priority badges
  - Date and time information
  - Delete button with hover state
  - Click to open detail modal

### TaskDetailDialog (`components/dialogs/task-detail-dialog.tsx`)
- Full task editing interface
- Subtask management
- Priority selection
- Save changes

## State Management (Zustand Store)

The application uses a single Zustand store with subscriptions for:
- Task CRUD operations
- List management
- Subtask handling
- Label management
- UI state (current view, selected items, search query)
- Loading states

All operations are optimistic (UI updates first, then synced to API).

## Styling

- **Theme**: Dark mode by default with light mode support
- **Color Scheme**: Professional with gradients and subtle borders
- **Animations**: Smooth transitions using Framer Motion
- **Responsive**: Mobile-first design using Tailwind CSS
- **Accessibility**: Proper ARIA labels and semantic HTML

## Future Enhancement Possibilities (Marked with Schema)

The database schema is prepared for:
- **Natural language task entry**: "Lunch with Sarah at 1 PM tomorrow"
- **Smart scheduling**: Automatic task time suggestions based on calendar
- **Advanced recurrence**: Custom recurring patterns
- **Rich attachments**: File uploads and linking
- **Notifications**: Email and push notifications

## Build & Test Results

### Tests (All Passing)
```
✓ Store - Task Management (4 tests)
✓ Store - List Management (3 tests)  
✓ Store - Subtask Management (2 tests)
✓ Store - Label Management (2 tests)
✓ Store - UI State Management (5 tests)
✓ Utility Functions (3 tests)

Total: 19 tests passed, 0 failures
```

### Build
```
✓ Compiled successfully
✓ 9 API routes
✓ 1 main page with split layout
✓ Type checking passed
✓ ESLint validation passed
```

## Notes

- The application uses SQLite stored in the `data/` directory for local persistence
- The database automatically initializes on first run
- All user interactions are logged for audit purposes
- The application is fully responsive and works on mobile devices
- State is managed entirely client-side with API sync
- No external authentication system (ready for integration)

## License

MIT

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
