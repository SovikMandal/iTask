import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/DB/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import reportRoutes from "./src/routes/reports.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";

const app = express();
dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const allowedOrigins = [
  "http://localhost:5173",
  "https://i-task-inky.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/reports", reportRoutes)
app.use('/api', uploadRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

export default app;