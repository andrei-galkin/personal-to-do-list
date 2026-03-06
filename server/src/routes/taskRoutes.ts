import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/taskController";
import { validateObjectId } from "../middleware/validateObjectId";

const router = Router();

// ─── Collection Routes ────────────────────────────────────────────────────────
router.get("/", getAllTasks);
router.post("/", createTask);

// ─── Item Routes ──────────────────────────────────────────────────────────────
router.get("/:id", validateObjectId, getTaskById);
router.patch("/:id", validateObjectId, updateTask);
router.delete("/:id", validateObjectId, deleteTask);
router.patch("/:id/toggle", validateObjectId, toggleTask);

export default router;
