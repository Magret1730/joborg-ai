import { PROMPT_VERSIONS } from "../../../constants/promptVersions.js";
import type { GenerateFinalReportPromptInput } from "../types/ai.types.js";

export const PROMPT_VERSION = PROMPT_VERSIONS.GENERATE_FINAL_REPORT;

export function buildGenerateFinalReportPrompt(
  input: GenerateFinalReportPromptInput,
): string {
  const questionsAndAnswers = input.answers
    .map((answer, index) => {
      const feedbackSummary =
        answer.feedback && typeof answer.feedback === "object"
          ? JSON.stringify(answer.feedback, null, 2)
          : "No detailed feedback available";

      return `Question ${index + 1} (${answer.questionType}):
${answer.questionText}

Candidate Answer:
${answer.answerText}

Score: ${answer.score}/100

Feedback:
${feedbackSummary}`;
    })
    .join("\n\n---\n\n");

  return `You are an expert technical interviewer and career coach.

Generate a final interview readiness report for the candidate based on their complete mock interview performance.

Interview Title: ${input.interviewTitle}
Company: ${input.companyName}
Job Description:
${input.jobDescription}

Interview Questions, Answers, Scores, and Feedback:
${questionsAndAnswers}

Requirements:
- Return JSON ONLY
- Do not include markdown
- Do not include explanations
- Do not wrap the response in a code block
- All scores must be integers from 0 to 100
- strengths must be an array of 3 to 5 concise strings
- weaknesses must be an array of 3 to 5 concise strings
- recommendations must be an array of 3 to 5 actionable strings
- summary must be 2 to 4 sentences summarizing overall performance
- verdict must be exactly one of: "Ready", "Almost Ready", "Needs More Practice"
- Base scores on the candidate's actual answer performance
- overallScore should reflect holistic interview readiness for this role

Return this exact JSON shape:
{
  "overallScore": 84,
  "technicalScore": 80,
  "communicationScore": 88,
  "readinessScore": 82,
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": ["string"],
  "summary": "string",
  "verdict": "Almost Ready"
}`;
}
