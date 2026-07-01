import { PROMPT_VERSIONS } from "../../../constants/promptVersions.js";
import type { EvaluateAnswerPromptInput } from "../types/ai.types.js";

export const PROMPT_VERSION = PROMPT_VERSIONS.EVALUATE_ANSWER;

export function buildEvaluateAnswerPrompt(
  input: EvaluateAnswerPromptInput,
): string {
  const hints =
    input.goodAnswerHints && input.goodAnswerHints.length > 0
      ? input.goodAnswerHints.map((hint) => `- ${hint}`).join("\n")
      : "None provided";

  return `You are an expert technical interviewer and career coach.

Evaluate the candidate's answer to the following interview question.

Question Type: ${input.questionType}
Question:
${input.questionText}

Good Answer Hints:
${hints}

Candidate Answer:
${input.answerText}

Requirements:
- Return JSON ONLY
- Do not include markdown
- Do not include explanations
- Do not wrap the response in a code block
- score must be an integer from 0 to 100
- strengths must be an array of 2 to 4 concise strings
- weaknesses must be an array of 2 to 4 concise strings
- improvedAnswer must be a polished example answer
- followUpQuestion must be one relevant follow-up question
- shortFeedback must be 1 to 2 sentences summarizing the evaluation

Return this exact JSON shape:
{
  "score": 82,
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvedAnswer": "string",
  "followUpQuestion": "string",
  "shortFeedback": "string"
}`;
}
