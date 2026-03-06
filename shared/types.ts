// shared/types.ts
// Single source of truth — imported by both server and client.
// No external dependencies — pure TypeScript only.

// ─── Kanban Status ────────────────────────────────────────────────────────────

export type TaskStatus = "ACTIVE" | "IN_PROGRESS" | "DONE";

export const TASK_STATUSES: TaskStatus[] = ["ACTIVE", "IN_PROGRESS", "DONE"];

// ─── Domain Model ─────────────────────────────────────────────────────────────

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  completed: boolean;   // derived: true when status === "DONE"
  createdAt: string;
  updatedAt: string;
}

// ─── Input / Command Types ────────────────────────────────────────────────────

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export type FilterStatus = "all" | "active" | "completed";

export interface TaskFormValues {
  title: string;
  description: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  inProgress: number;
}

// ─── Kanban Column Definition ─────────────────────────────────────────────────

export interface KanbanColumn {
  id: TaskStatus;
  label: string;
  icon: string;
  accent: string;   // CSS color for column header accent
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "ACTIVE",      label: "Active",      icon: "bi-circle",         accent: "#f59e0b" },
  { id: "IN_PROGRESS", label: "In Progress", icon: "bi-arrow-repeat",   accent: "#3b82f6" },
  { id: "DONE",        label: "Done",        icon: "bi-check-circle",   accent: "#22c55e" },
];
