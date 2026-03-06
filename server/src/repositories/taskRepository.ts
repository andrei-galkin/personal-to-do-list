import { db, toTask, TaskEntity } from "../models/taskModel";
import type { Task, CreateTaskInput, UpdateTaskInput, PaginatedResponse } from "@todo/shared";

// ─── Query Options ────────────────────────────────────────────────────────────

export interface FindAllOptions {
  completed?: boolean;
  page?: number;
  limit?: number;
}

// ─── Repository Interface ─────────────────────────────────────────────────────

export interface ITaskRepository {
  findAll(options: FindAllOptions): PaginatedResponse<Task>;
  findById(id: number): Task | null;
  create(input: CreateTaskInput): Task;
  update(id: number, input: UpdateTaskInput): Task | null;
  delete(id: number): boolean;
  toggle(id: number): Task | null;
}

// ─── SQLite Implementation ────────────────────────────────────────────────────

export class TaskRepository implements ITaskRepository {

  findAll({ completed, page = 1, limit = 20 }: FindAllOptions): PaginatedResponse<Task> {
    const offset = (page - 1) * limit;
    const whereClause = completed !== undefined ? "WHERE completed = ?" : "";
    const params: unknown[] = completed !== undefined ? [completed ? 1 : 0] : [];

    const rows = db
      .prepare(`SELECT * FROM tasks ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .all([...params, limit, offset]) as TaskEntity[];

    const { count } = db
      .prepare(`SELECT COUNT(*) as count FROM tasks ${whereClause}`)
      .get(params) as { count: number };

    return {
      success: true,
      data: rows.map(toTask),
      total: count,
      page,
      limit,
    };
  }

  findById(id: number): Task | null {
    const entity = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(id) as TaskEntity | undefined;

    return entity ? toTask(entity) : null;
  }

  create(input: CreateTaskInput): Task {
    const { title, description = "", completed = false } = input;

    const entity = db
      .prepare(
        `INSERT INTO tasks (title, description, completed)
         VALUES (?, ?, ?)
         RETURNING *`
      )
      .get(title, description, completed ? 1 : 0) as TaskEntity;

    return toTask(entity);
  }

  update(id: number, input: UpdateTaskInput): Task | null {
    const existing = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(id) as TaskEntity | undefined;

    if (!existing) return null;

    const entity = db
      .prepare(
        `UPDATE tasks
         SET title       = COALESCE(?, title),
             description = COALESCE(?, description),
             completed   = COALESCE(?, completed),
             updated_at  = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
         WHERE id = ?
         RETURNING *`
      )
      .get(
        input.title ?? null,
        input.description ?? null,
        input.completed !== undefined ? (input.completed ? 1 : 0) : null,
        id
      ) as TaskEntity;

    return toTask(entity);
  }

  delete(id: number): boolean {
    const result = db
      .prepare("DELETE FROM tasks WHERE id = ? RETURNING id")
      .get(id) as { id: number } | undefined;

    return result !== undefined;
  }

  toggle(id: number): Task | null {
    const existing = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(id) as TaskEntity | undefined;

    if (!existing) return null;

    const entity = db
      .prepare(
        `UPDATE tasks
         SET completed  = CASE WHEN completed = 1 THEN 0 ELSE 1 END,
             updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
         WHERE id = ?
         RETURNING *`
      )
      .get(id) as TaskEntity;

    return toTask(entity);
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────

export const taskRepository = new TaskRepository();
