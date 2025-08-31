import express from "express";
import { upload, uploadAndCloudinary } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadAndCloudinary, (req, res) => {
  res.json({ url: req.file.cloudinaryUrl });
});

export default router;