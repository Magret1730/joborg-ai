import { Router } from "express";
import {
  createInterview,
  getInterview,
  listInterviews,
} from "./interview.controller.js";

const interviewRoutes = Router();

interviewRoutes.get("/", listInterviews);
interviewRoutes.post("/", createInterview);
interviewRoutes.get("/:id", getInterview);

export default interviewRoutes;
