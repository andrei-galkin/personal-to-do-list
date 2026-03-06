// client/src/types/hook-types.ts
// Return type interfaces for custom hooks.

import type { Task, CreateTaskInput, UpdateTaskInput, FilterStatus, TaskStats } from "@todo/shared";

// ─── useTasks ─────────────────────────────────────────────────────────────────

export interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  filter: FilterStatus;
  stats: TaskStats;
  setFilter: (filter: FilterStatus) => void;
  addTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  clearError: () => void;
  refresh: () => Promise<void>;
}
