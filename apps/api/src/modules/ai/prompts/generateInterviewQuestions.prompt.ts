import { PROMPT_VERSIONS } from "../../../constants/promptVersions.js";
import {
  EXPECTED_QUESTION_COUNT,
  questionDifficultySchemaValues,
  questionTypeSchemaValues,
  type GenerateInterviewPromptInput,
} from "../types/ai.types.js";

export const PROMPT_VERSION = PROMPT_VERSIONS.GENERATE_INTERVIEW_QUESTIONS;

export function buildGenerateInterviewPrompt(
  input: GenerateInterviewPromptInput,
): string {
  const questionTypes = questionTypeSchemaValues.join(", ");
  const difficulties = questionDifficultySchemaValues.join(", ");

  return `You are an expert technical interviewer and career coach.

Generate a mock interview for the following role.

Job Title: ${input.title}
Company: ${input.companyName}
Job Description:
${input.jobDescription}

Requirements:
- Return JSON ONLY
- Do not include markdown
- Do not include explanations
- Do not wrap the response in a code block
- Generate exactly ${EXPECTED_QUESTION_COUNT} interview questions
- Include a mix of question types when appropriate: ${questionTypes}
- Include system_design only when appropriate for the role
- Each question must include: id, question, type, difficulty, goodAnswerHints
- id must be a short unique string like q1, q2, q3, q4, q5
- type must be one of: ${questionTypes}
- difficulty must be one of: ${difficulties}
- goodAnswerHints must be an array of 2 to 4 concise strings

Return this exact JSON shape:
{
  "interviewTitle": "string",
  "questions": [
    {
      "id": "q1",
      "question": "string",
      "type": "technical",
      "difficulty": "medium",
      "goodAnswerHints": ["string"]
    }
  ]
}`;
}
