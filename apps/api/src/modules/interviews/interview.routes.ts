import { Router } from "express";
import { evaluateAnswerSchema } from "../../lib/validation/evaluateAnswer.schema.js";
import { generateInterviewSchema } from "../../lib/validation/generateInterview.schema.js";
import { validateBody } from "../../lib/validation/validate.js";
import {
  generateInterview,
  getInterview,
  listInterviews,
  submitAnswer,
} from "./interview.controller.js";

const interviewRoutes = Router();

interviewRoutes.post(
  "/generate",
  validateBody(generateInterviewSchema),
  generateInterview,
);
interviewRoutes.get("/", listInterviews);
interviewRoutes.post(
  "/:id/answers",
  validateBody(evaluateAnswerSchema),
  submitAnswer,
);
interviewRoutes.get("/:id", getInterview);

export default interviewRoutes;
