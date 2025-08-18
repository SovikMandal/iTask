import express from "express";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { createTasks, deleteTask, getDashboardData, getTaskById, getTasks, getUserDashboardData, updateTask, updateTaskChecklist, updateTaskStatus } from "../controllers/task.controller.js";

const router = express.Router();

// Task Management Routes
router.get("/", protect, getTasks);
router.post("/", protect, adminOnly, createTasks);
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskChecklist);

export default router;
