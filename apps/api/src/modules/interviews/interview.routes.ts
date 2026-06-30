import { Router } from "express";
import { generateInterviewSchema } from "../../lib/validation/generateInterview.schema.js";
import { validateBody } from "../../lib/validation/validate.js";
import {
  generateInterview,
  getInterview,
  listInterviews,
} from "./interview.controller.js";

const interviewRoutes = Router();

interviewRoutes.post(
  "/generate",
  validateBody(generateInterviewSchema),
  generateInterview,
);
interviewRoutes.get("/", listInterviews);
interviewRoutes.get("/:id", getInterview);

export default interviewRoutes;
