import express from "express";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { exportTaskReport, exportUserReport } from "../controllers/report.controller.js";

const router = express.Router();

router.get("/export/tasks", protect, adminOnly, exportTaskReport);
router.get("/export/users", protect, adminOnly, exportUserReport);

export default router;