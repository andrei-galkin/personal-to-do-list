// client/src/types/componentProps.ts
// All React component prop interfaces in one place.

import type {
  Task,
  TaskFormValues,
  TaskStatus,
  TaskStats,
  KanbanColumn,
  FilterStatus,
} from "@todo/shared";

// ─── FilterBar ─────────────────────────────────────────────────────────────────

export interface FilterBarProps {
  filter: FilterStatus;
  stats: TaskStats;
  onFilterChange: (filter: FilterStatus) => void;
}

// ─── TaskItem ──────────────────────────────────────────────────────────────────

export interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, values: TaskFormValues) => Promise<void>;
  onDelete: (id: string) => void;
}

// ─── TaskForm ─────────────────────────────────────────────────────────────────

export interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => Promise<void>;
  initialValues?: TaskFormValues;
  submitLabel?: string;
  autoFocus?: boolean;
  editingTask?: Task | null;
}

// ─── TaskCard (Kanban) ────────────────────────────────────────────────────────

export interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// ─── KanbanColumn ─────────────────────────────────────────────────────────────

export interface KanbanColumnProps {
  column: KanbanColumn;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// ─── KanbanBoard ──────────────────────────────────────────────────────────────

export interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// ─── EditTaskModal ────────────────────────────────────────────────────────────

export interface EditTaskModalProps {
  task: Task | null;
  onSave: (id: string, values: TaskFormValues) => Promise<void>;
  onClose: () => void;
}

// ─── StatsBar ─────────────────────────────────────────────────────────────────

export interface StatsBarProps {
  stats: TaskStats;
}
