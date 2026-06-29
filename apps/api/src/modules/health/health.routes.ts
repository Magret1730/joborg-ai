import { Router } from "express";
import { getHealth } from "./health.controller.js";

const healthRoutes = Router();

healthRoutes.get("/health", getHealth);

export default healthRoutes;
