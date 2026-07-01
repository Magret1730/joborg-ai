import { z } from "zod";
import { QUESTION_TYPES } from "../../constants/questionTypes.js";

const questionTypeValues = Object.values(QUESTION_TYPES) as [
  string,
  ...string[],
];

export const evaluateAnswerSchema = z.object({
  questionIndex: z
    .number()
    .int("Question index must be an integer")
    .min(0, "Question index must be at least 0"),
  questionText: z
    .string()
    .trim()
    .min(1, "Question text is required")
    .max(5000, "Question text must be at most 5000 characters"),
  questionType: z.enum(questionTypeValues, {
    message: "Invalid question type",
  }),
  answerText: z
    .string()
    .trim()
    .min(1, "Answer text is required")
    .max(10000, "Answer text must be at most 10000 characters"),
  goodAnswerHints: z.array(z.string().min(1)).optional(),
});

export type EvaluateAnswerInput = z.infer<typeof evaluateAnswerSchema>;
