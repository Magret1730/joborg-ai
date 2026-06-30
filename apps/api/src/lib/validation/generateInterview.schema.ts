import { z } from "zod";

export const generateInterviewSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be at most 200 characters"),
  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(200, "Company name must be at most 200 characters"),
  jobDescription: z
    .string()
    .trim()
    .min(50, "Job description must be at least 50 characters")
    .max(15000, "Job description must be at most 15000 characters"),
});

export type GenerateInterviewInput = z.infer<typeof generateInterviewSchema>;
