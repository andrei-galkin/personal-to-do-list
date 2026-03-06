import { Router } from "express";
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from "../controllers/taskController";
import { validateObjectId } from "../middleware/validateObjectId";

const router = Router();

router.get("/",        getAllTasks);
router.post("/",       createTask);
router.get("/:id",     validateObjectId, getTaskById);
router.patch("/:id",   validateObjectId, updateTask);
router.delete("/:id",  validateObjectId, deleteTask);

export default router;
