# Quick Start Guide

## Installation & Running

### 1. Install Dependencies
```bash
cd /Users/lasse/Sites/todo-amp
bun install
```

### 2. Start Development Server
```bash
bun run dev
```

The app will be available at `http://localhost:3000`

### 3. Run Tests
```bash
bun test
```

## Using the App

### Create Your First Task
1. Click the **"New Task"** button in the top right
2. Enter a task name and optional description
3. Select which list to add it to
4. Click **"Create Task"**

### Organize with Lists
1. Click the **"+"** button next to "Lists" in the sidebar
2. Enter a list name
3. Choose a color and emoji
4. Click **"Create"**

### View Tasks in Different Ways
- **Today**: Tasks scheduled for today
- **Next 7 Days**: Tasks for the upcoming week
- **Upcoming**: All future tasks
- **All**: Every task in every list

### Add Subtasks
1. Click on a task to open its detail view
2. In the "Subtasks" section, type a subtask name
3. Click the "+" button to add it
4. Check off subtasks as you complete them

### Create Labels
1. Click the **"+"** button next to "Labels" in the sidebar
2. Enter a label name  
3. Choose a color and emoji
4. Click **"Create"**

### Search Tasks
1. Use the search bar in the main panel
2. Type to filter tasks by name or description
3. Results update in real-time

### Complete Tasks
1. Check the checkbox next to a task to mark it complete
2. Completed tasks can be hidden by toggling "Show Completed"

### Edit Task Details
1. Click on a task to open details
2. Edit name, description, or priority
3. Click **"Save Changes"**

### Delete Tasks
1. Hover over a task
2. Click the trash icon
3. Confirm the deletion

## Build for Production

```bash
bun run build
bun run start
```

## Key Keyboard Shortcuts (In Development)
- `Cmd+K` / `Ctrl+K`: Open command palette (Next.js dev)
- Search bar is always focused and ready for input

## Troubleshooting

### Database Issue
If you encounter database issues, delete the `data/app.db` file and restart:
```bash
rm data/app.db
bun run dev
```

### Port Already in Use
If port 3000 is in use, Next.js will try 3001, 3002, etc.

### Module Not Found
Make sure you've run `bun install` to install all dependencies.

---

For more detailed information, see the full [README.md](./README.md)
