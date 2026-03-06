import { useState, useEffect, useCallback } from "react";
import { taskService } from "../services/taskService";
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskStats } from "../../../shared/types";

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

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.getAll({ limit: 100 });
      setTasks(res.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ─── Derived Stats ────────────────────────────────────────────────────────

  const stats: TaskStats = {
    total:      tasks.length,
    completed:  tasks.filter((t) => t.status === "DONE").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    active:     tasks.filter((t) => t.status === "ACTIVE").length,
  };

  // ─── Mutations ────────────────────────────────────────────────────────────

  const addTask = useCallback(async (input: CreateTaskInput) => {
    try {
      setError(null);
      const task = await taskService.create(input);
      setTasks((prev) => [task, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, input: UpdateTaskInput) => {
    try {
      setError(null);
      const updated = await taskService.update(id, input);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
      throw err;
    }
  }, []);

  // Optimistic status move for instant drag-and-drop feel
  const moveTask = useCallback(async (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => t._id === id ? { ...t, status, completed: status === "DONE" } : t)
    );
    try {
      const updated = await taskService.update(id, { status });
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      // Rollback
      await fetchTasks();
      setError(err instanceof Error ? err.message : "Failed to move task");
    }
  }, [fetchTasks]);

  const removeTask = useCallback(async (id: string) => {
    try {
      setError(null);
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { tasks, loading, error, stats, addTask, updateTask, moveTask, removeTask, clearError, refresh: fetchTasks };
};
