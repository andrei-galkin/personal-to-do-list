import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { taskRepository } from "../repositories/task.repository";
import { AppError } from "../middleware/errorHandler";

// ─── Validation Schemas ───────────────────────────────────────────────────────

const TaskStatusEnum = z.enum(["ACTIVE", "IN_PROGRESS", "DONE"]);

const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be ≤ 100 characters"),
  description: z.string().max(500, "Description must be ≤ 500 characters").optional().default(""),
  status: TaskStatusEnum.default("ACTIVE"),
});

const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: TaskStatusEnum.optional(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatZodError = (err: ZodError): Record<string, string[]> =>
  err.errors.reduce<Record<string, string[]>>((acc, issue) => {
    const key = issue.path.join(".") || "root";
    acc[key] = [...(acc[key] ?? []), issue.message];
    return acc;
  }, {});

const parseId = (raw: string): number => {
  const id = parseInt(raw, 10);
  if (isNaN(id) || id < 1) throw new AppError("Invalid task ID", 400);
  return id;
};

// ─── GET /api/tasks ───────────────────────────────────────────────────────────

export const getAllTasks = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { status, page = "1", limit = "100" } = req.query;
    const result = taskRepository.findAll({
      status: status as string | undefined,
      page: Math.max(1, parseInt(page as string, 10)),
      limit: Math.min(100, Math.max(1, parseInt(limit as string, 10))),
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────

export const getTaskById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const task = taskRepository.findById(parseId(req.params.id));
    if (!task) throw new AppError("Task not found", 404);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/tasks ──────────────────────────────────────────────────────────

export const createTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const parsed = CreateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Validation failed", errors: formatZodError(parsed.error) });
      return;
    }
    const task = taskRepository.create(parsed.data);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/tasks/:id ─────────────────────────────────────────────────────

export const updateTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const parsed = UpdateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Validation failed", errors: formatZodError(parsed.error) });
      return;
    }
    const task = taskRepository.update(parseId(req.params.id), parsed.data);
    if (!task) throw new AppError("Task not found", 404);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────

export const deleteTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const deleted = taskRepository.delete(parseId(req.params.id));
    if (!deleted) throw new AppError("Task not found", 404);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};
