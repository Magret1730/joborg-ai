import { Router } from "express";
import { evaluateAnswerSchema } from "../../lib/validation/evaluateAnswer.schema.js";
import { generateInterviewSchema } from "../../lib/validation/generateInterview.schema.js";
import { validateBody } from "../../lib/validation/validate.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  deleteInterview,
  generateFinalReport,
  generateInterview,
  getInterview,
  listInterviews,
  submitAnswer,
} from "./interview.controller.js";

const interviewRoutes = Router();

interviewRoutes.use(requireAuth);

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
interviewRoutes.post("/:id/final-report", generateFinalReport);
interviewRoutes.get("/:id", getInterview);
interviewRoutes.delete("/:id", deleteInterview);

export default interviewRoutes;
