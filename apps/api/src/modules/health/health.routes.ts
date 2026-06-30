import { Router } from "express";
import { getDatabaseHealth, getHealth } from "./health.controller.js";

const healthRoutes = Router();

healthRoutes.get("/health", getHealth);
healthRoutes.get("/health/db", getDatabaseHealth);

export default healthRoutes;
