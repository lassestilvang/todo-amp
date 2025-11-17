# Task Planner API Documentation

## Base URL
```
http://localhost:3000/api
```

## Lists Endpoints

### GET /lists
Get all lists.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Inbox",
    "color": "#3B82F6",
    "emoji": "📥",
    "isDefault": 1,
    "createdAt": 1700000000000,
    "updatedAt": 1700000000000
  }
]
```

### POST /lists
Create a new list.

**Request Body:**
```json
{
  "name": "Work",
  "color": "#3B82F6",
  "emoji": "💼"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Work",
  "color": "#3B82F6",
  "emoji": "💼",
  "isDefault": 0,
  "createdAt": 1700000000000,
  "updatedAt": 1700000000000
}
```

### GET /lists/[id]
Get a specific list.

**Response:**
```json
{
  "id": "uuid",
  "name": "Work",
  "color": "#3B82F6",
  "emoji": "💼",
  "isDefault": 0,
  "createdAt": 1700000000000,
  "updatedAt": 1700000000000
}
```

### PATCH /lists/[id]
Update a list.

**Request Body:**
```json
{
  "name": "Projects",
  "color": "#8B5CF6",
  "emoji": "🎨"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Projects",
  "color": "#8B5CF6",
  "emoji": "🎨",
  "isDefault": 0,
  "createdAt": 1700000000000,
  "updatedAt": 1700000001000
}
```

### DELETE /lists/[id]
Delete a list (cannot delete Inbox).

**Response:** `200 OK`
```json
{
  "success": true
}
```

**Error:** `400 Bad Request`
```json
{
  "error": "Cannot delete the inbox list"
}
```

---

## Tasks Endpoints

### GET /tasks
Get all tasks. Optional filtering by list.

**Query Parameters:**
- `listId` (optional): Filter by list ID

**Response:**
```json
[
  {
    "id": "uuid",
    "listId": "uuid",
    "name": "Complete project proposal",
    "description": "Draft and submit Q1 proposal",
    "date": 1700000000000,
    "deadline": 1700086400000,
    "priority": "high",
    "estimatedTime": "2:30",
    "actualTime": "2:15",
    "completed": false,
    "completedAt": null,
    "createdAt": 1700000000000,
    "updatedAt": 1700000000000
  }
]
```

### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "listId": "uuid",
  "name": "Complete project proposal",
  "description": "Draft and submit Q1 proposal",
  "date": 1700000000000,
  "deadline": 1700086400000,
  "priority": "high",
  "estimatedTime": "2:30",
  "actualTime": ""
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "listId": "uuid",
  "name": "Complete project proposal",
  "description": "Draft and submit Q1 proposal",
  "date": 1700000000000,
  "deadline": 1700086400000,
  "priority": "high",
  "estimatedTime": "2:30",
  "actualTime": "",
  "completed": false,
  "completedAt": null,
  "createdAt": 1700000000000,
  "updatedAt": 1700000000000
}
```

### GET /tasks/[id]
Get a specific task.

**Response:**
```json
{
  "id": "uuid",
  "listId": "uuid",
  "name": "Complete project proposal",
  "description": "Draft and submit Q1 proposal",
  "date": 1700000000000,
  "deadline": 1700086400000,
  "priority": "high",
  "estimatedTime": "2:30",
  "actualTime": "2:15",
  "completed": false,
  "completedAt": null,
  "createdAt": 1700000000000,
  "updatedAt": 1700000000000
}
```

### PATCH /tasks/[id]
Update a task.

**Request Body:**
```json
{
  "name": "Complete and submit project proposal",
  "completed": true,
  "priority": "medium"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "listId": "uuid",
  "name": "Complete and submit project proposal",
  "description": "Draft and submit Q1 proposal",
  "date": 1700000000000,
  "deadline": 1700086400000,
  "priority": "medium",
  "estimatedTime": "2:30",
  "actualTime": "2:15",
  "completed": true,
  "completedAt": 1700050000000,
  "createdAt": 1700000000000,
  "updatedAt": 1700050000000
}
```

### DELETE /tasks/[id]
Delete a task (also deletes all related subtasks).

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

## Subtasks Endpoints

### GET /subtasks
Get subtasks for a task.

**Query Parameters:**
- `taskId` (required): Task ID or "all" for all subtasks

**Response:**
```json
[
  {
    "id": "uuid",
    "taskId": "uuid",
    "name": "Write executive summary",
    "completed": false,
    "completedAt": null,
    "createdAt": 1700000000000
  },
  {
    "id": "uuid",
    "taskId": "uuid",
    "name": "Get team sign-off",
    "completed": true,
    "completedAt": 1700030000000,
    "createdAt": 1700000100000
  }
]
```

### POST /subtasks
Create a new subtask.

**Request Body:**
```json
{
  "taskId": "uuid",
  "name": "Write executive summary"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "taskId": "uuid",
  "name": "Write executive summary",
  "completed": false,
  "completedAt": null,
  "createdAt": 1700000000000
}
```

### PATCH /subtasks/[id]
Update a subtask.

**Request Body:**
```json
{
  "name": "Write detailed executive summary",
  "completed": true
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "taskId": "uuid",
  "name": "Write detailed executive summary",
  "completed": true,
  "completedAt": 1700050000000,
  "createdAt": 1700000000000
}
```

### DELETE /subtasks/[id]
Delete a subtask.

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

## Labels Endpoints

### GET /labels
Get all labels.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Urgent",
    "color": "#EF4444",
    "emoji": "🔥",
    "createdAt": 1700000000000,
    "updatedAt": 1700000000000
  },
  {
    "id": "uuid",
    "name": "Follow-up",
    "color": "#3B82F6",
    "emoji": "📌",
    "createdAt": 1700000000000,
    "updatedAt": 1700000000000
  }
]
```

### POST /labels
Create a new label.

**Request Body:**
```json
{
  "name": "Important",
  "color": "#F59E0B",
  "emoji": "⭐"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Important",
  "color": "#F59E0B",
  "emoji": "⭐",
  "createdAt": 1700000000000,
  "updatedAt": 1700000000000
}
```

---

## Data Types

### Priority
- `"high"` - High priority
- `"medium"` - Medium priority
- `"low"` - Low priority
- `"none"` - No priority (default)

### Time Format
Time estimates and actuals use HH:mm format (e.g., "2:30", "1:15")

### Timestamps
All timestamps are milliseconds since epoch (JavaScript Date.now() format)

### IDs
All IDs are UUIDs (generated by uuid package)

### Colors
Colors are hex codes with 7 characters (e.g., "#3B82F6")
Available colors in the UI:
- `#3B82F6` - Blue
- `#8B5CF6` - Purple
- `#EC4899` - Pink
- `#F59E0B` - Amber
- `#10B981` - Emerald
- `#06B6D4` - Cyan
- `#EF4444` - Red

### Emojis
Supported list emojis: 📥📋🎯🚀💼🎨📚🏃🎮🎵
Supported label emojis: 🏷️🔖⭐🎨🔥📌💡✨🎯🚀

---

## Error Responses

### 400 Bad Request
Missing required fields or invalid data.

```json
{
  "error": "Missing required fields"
}
```

### 404 Not Found
Resource does not exist.

```json
{
  "error": "Task not found"
}
```

### 500 Internal Server Error
Server encountered an error.

```json
{
  "error": "Failed to create task"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid data |
| 404 | Not Found - Resource does not exist |
| 500 | Server Error - Internal server error |

---

## Example Usage

### Creating a Task with Subtasks

```javascript
// 1. Create the task
const taskResponse = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    listId: 'list-uuid',
    name: 'Project Planning',
    description: 'Plan Q1 projects',
    priority: 'high',
    estimatedTime: '3:00'
  })
});
const task = await taskResponse.json();

// 2. Add subtasks
await fetch('/api/subtasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    taskId: task.id,
    name: 'Gather requirements'
  })
});

await fetch('/api/subtasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    taskId: task.id,
    name: 'Create timeline'
  })
});
```

### Completing a Task

```javascript
await fetch('/api/tasks/task-uuid', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    completed: true,
    actualTime: '2:45'
  })
});
```

### Filtering Tasks by List

```javascript
const response = await fetch('/api/tasks?listId=list-uuid');
const tasks = await response.json();
```

---

## Implementation Notes

- All API routes are **Next.js API Routes** (serverless functions)
- Database uses **SQLite with prepared statements** (SQL injection safe)
- All timestamps are in **milliseconds** (JavaScript standard)
- State is synced with **Zustand** on the client
- All requests validate required fields
- All responses include proper **HTTP status codes**

---

## Related Documentation

- [README.md](./README.md) - Full feature documentation
- [QUICK_START.md](./QUICK_START.md) - Getting started guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [FEATURES_CHECKLIST.md](./FEATURES_CHECKLIST.md) - Feature checklist
