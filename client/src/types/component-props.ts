// client/src/types/component-props.ts
// All React component prop interfaces in one place.

import type { Task, TaskFormValues, FilterStatus, TaskStats } from "@todo/shared";

// ─── FilterBar ────────────────────────────────────────────────────────────────

export interface FilterBarProps {
  filter: FilterStatus;
  stats: TaskStats;
  onFilterChange: (filter: FilterStatus) => void;
}

// ─── TaskForm ─────────────────────────────────────────────────────────────────

export interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => Promise<void>;
  initialValues?: TaskFormValues;
  submitLabel?: string;
  autoFocus?: boolean;
  editingTask?: Task | null;
}

// ─── TaskItem ─────────────────────────────────────────────────────────────────

export interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onUpdate: (id: string, values: TaskFormValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}
