import multer from "multer";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/jpg",
    "image/webp",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .png, .gif, .jpg, .webp are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

const uploadAndCloudinary = async (req, res, next) => {
  try {
    if (!req.file) return next();
    const result = await uploadToCloudinary(req.file.path);
    req.file.cloudinaryUrl = result.secure_url;
    next();
  } catch (error) {
    next(error);
  }
};

export { upload, uploadAndCloudinary };