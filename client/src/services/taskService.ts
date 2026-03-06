import axios, { AxiosError } from "axios";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  ApiResponse,
  PaginatedResponse,
} from "@todo/shared";

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// ─── Response Interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiResponse<unknown>>) => {
    const message =
      err.response?.data?.message ?? err.message ?? "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

// ─── Task Service ─────────────────────────────────────────────────────────────

export const taskService = {
  /**
   * Fetch all tasks with optional filters.
   */
  getAll: async (params?: {
    completed?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<PaginatedResponse<Task>> => {
    const { data } = await api.get<PaginatedResponse<Task>>("/tasks", { params });
    return data;
  },

  /**
   * Fetch a single task by ID.
   */
  getById: async (id: string): Promise<Task> => {
    const { data } = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return data.data!;
  },

  /**
   * Create a new task.
   */
  create: async (payload: CreateTaskInput): Promise<Task> => {
    const { data } = await api.post<ApiResponse<Task>>("/tasks", payload);
    return data.data!;
  },

  /**
   * Update an existing task (partial update).
   */
  update: async (id: string, payload: UpdateTaskInput): Promise<Task> => {
    const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, payload);
    return data.data!;
  },

  /**
   * Delete a task.
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  /**
   * Toggle the completed status of a task.
   */
  toggle: async (id: string): Promise<Task> => {
    const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${id}/toggle`);
    return data.data!;
  },
};
