import { useState, useEffect, useCallback } from "react";
import { taskService } from "../services/taskService";
import type { Task, CreateTaskInput, UpdateTaskInput, FilterStatus, TaskStats } from "@todo/shared";
import type { UseTasksReturn } from "../types/hook-types";

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");

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

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ─── Derived State ────────────────────────────────────────────────────────

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const stats: TaskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    active: tasks.filter((t) => !t.completed).length,
  };

  // ─── Mutations ────────────────────────────────────────────────────────────

  const addTask = useCallback(async (input: CreateTaskInput) => {
    try {
      setError(null);
      const newTask = await taskService.create(input);
      setTasks((prev) => [newTask, ...prev]);
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

  const toggleTask = useCallback(async (id: string) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      const updated = await taskService.toggle(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      // Rollback on failure
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
      );
      setError(err instanceof Error ? err.message : "Failed to toggle task");
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    filter,
    stats,
    setFilter,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    clearError,
    refresh: fetchTasks,
  };
};
