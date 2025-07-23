import express from "express";
import cors from "cors";
import config from "./config/config.js";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
connectDB();

app.use(
  cors({
    origin: [
      `${config.FRONTEND_URL} || http://localhost:5173`,
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import auditLogsRoutes from "./routes/auditLogsRoutes.js";
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", expenseRoutes);
app.use("/api", auditLogsRoutes);

app.use(notFound);
app.use(errorHandler);

const port = config.PORT;
app.listen(port, () => {
  console.log(`server runming on http://localhost:${port}`);
});
