import { Router } from "express";
import { loginSchema, registerSchema } from "../../lib/validation/auth.schema.js";
import { validateBody } from "../../lib/validation/validate.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { getMe, login, logout, register } from "./auth.controller.js";

const authRoutes = Router();

authRoutes.post("/register", validateBody(registerSchema), register);
authRoutes.post("/login", validateBody(loginSchema), login);
authRoutes.get("/me", requireAuth, getMe);
authRoutes.post("/logout", logout);

export default authRoutes;
