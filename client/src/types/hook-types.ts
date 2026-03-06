// client/src/types/hook-types.ts
// Return type interfaces for custom hooks.

import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskStats } from "../../../../shared/types";

// ─── useTasks ─────────────────────────────────────────────────────────────────

export interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  stats: TaskStats;
  addTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  moveTask: (id: string, status: TaskStatus) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  clearError: () => void;
  refresh: () => Promise<void>;
}
