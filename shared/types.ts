// shared/types.ts
// Single source of truth — imported by both server and client.
// No external dependencies — pure TypeScript only.

// ─── Domain Model ─────────────────────────────────────────────────────────────

export interface Task {
  _id: string;            // string representation of SQLite integer ID
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Input / Command Types ────────────────────────────────────────────────────

export interface CreateTaskInput {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
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
}
