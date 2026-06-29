import cors from "cors";
import express from "express";
import { createHealthCheckResponse } from "@joborg-ai/shared";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
  }),
);
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.json(createHealthCheckResponse("joborg-ai-api"));
});

export default app;
