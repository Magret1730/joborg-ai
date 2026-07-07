import cors from "cors";
import express from "express";
import { getCorsOptions } from "./config/cors.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { requestLogger } from "./middleware/requestLogger.js";
import healthRoutes from "./modules/health/health.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import interviewRoutes from "./modules/interviews/interview.routes.js";

const app = express();

app.use(cors(getCorsOptions()));
app.use(express.json());
app.use(requestLogger);

app.use("/api/v1", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/interviews", interviewRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
