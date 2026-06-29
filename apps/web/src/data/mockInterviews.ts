import type {
  DashboardStats,
  InterviewFeedback,
  InterviewQuestion,
  InterviewReport,
  InterviewSummary,
} from "@/types/interview";

export const dashboardStats: DashboardStats = {
  interviewsCompleted: 12,
  averageScore: 78,
  readinessScore: 82,
  lastInterview: "Frontend Engineer at Stripe — 2 days ago",
};

export const mockInterviews: InterviewSummary[] = [
  {
    id: "int-001",
    jobTitle: "Frontend Engineer",
    company: "Stripe",
    score: 84,
    status: "completed",
    date: "2026-06-27",
  },
  {
    id: "int-002",
    jobTitle: "Full Stack Developer",
    company: "Notion",
    score: 76,
    status: "completed",
    date: "2026-06-24",
  },
  {
    id: "int-003",
    jobTitle: "Software Engineer II",
    company: "Airbnb",
    score: null,
    status: "in_progress",
    date: "2026-06-22",
  },
  {
    id: "int-004",
    jobTitle: "React Developer",
    company: "Vercel",
    score: 71,
    status: "completed",
    date: "2026-06-18",
  },
  {
    id: "int-005",
    jobTitle: "UI Engineer",
    company: "Linear",
    score: 68,
    status: "abandoned",
    date: "2026-06-15",
  },
];

export const mockQuestions: InterviewQuestion[] = [
  {
    id: "q-1",
    type: "behavioral",
    question:
      "Tell me about a time you improved the performance of a web application. What was the bottleneck and how did you measure success?",
  },
  {
    id: "q-2",
    type: "technical",
    question:
      "How would you design a reusable data-fetching layer in a Next.js app that supports caching, retries, and optimistic updates?",
  },
  {
    id: "q-3",
    type: "situational",
    question:
      "A product manager asks for a feature that will ship quickly but adds noticeable technical debt. How do you respond?",
  },
  {
    id: "q-4",
    type: "technical",
    question:
      "Explain how you would debug a hydration mismatch error in a React application.",
  },
  {
    id: "q-5",
    type: "behavioral",
    question:
      "Describe a situation where you received critical feedback on your code. How did you handle it?",
  },
];

export const mockFeedback: InterviewFeedback = {
  summary:
    "Strong structure and relevant examples. You explained trade-offs clearly, but could be more concise when discussing implementation details.",
  score: 82,
  tips: [
    "Lead with the outcome before diving into technical steps.",
    "Quantify impact with metrics when possible.",
    "Pause briefly to confirm you understood the question.",
  ],
};

export const mockReports: Record<string, InterviewReport> = {
  "int-001": {
    id: "int-001",
    jobTitle: "Frontend Engineer",
    company: "Stripe",
    overallScore: 84,
    technical: 86,
    communication: 80,
    problemSolving: 85,
    readiness: 83,
    strengths: [
      "Clear explanation of React rendering and state management",
      "Good use of real project examples",
      "Confident communication under follow-up questions",
    ],
    weaknesses: [
      "Could provide more specific performance metrics",
      "Answer length was occasionally verbose",
    ],
    recommendations: [
      "Practice STAR-format answers under a 2-minute timer",
      "Review browser performance profiling tools",
      "Prepare 2–3 concise stories about cross-team collaboration",
    ],
    verdict: "almost_ready",
  },
  "int-002": {
    id: "int-002",
    jobTitle: "Full Stack Developer",
    company: "Notion",
    overallScore: 76,
    technical: 74,
    communication: 78,
    problemSolving: 75,
    readiness: 77,
    strengths: [
      "Solid understanding of API design",
      "Thoughtful approach to error handling",
    ],
    weaknesses: [
      "System design answers lacked depth on scalability",
      "Hesitated on database indexing questions",
    ],
    recommendations: [
      "Study distributed systems basics",
      "Practice whiteboard-style architecture questions",
    ],
    verdict: "needs_practice",
  },
};

export function getInterviewById(id: string): InterviewSummary | undefined {
  return mockInterviews.find((interview) => interview.id === id);
}

export function getReportById(id: string): InterviewReport | undefined {
  return mockReports[id];
}

export const exampleJobDescription = `We are looking for a Frontend Engineer to build polished, accessible user interfaces for our career platform.

Responsibilities:
- Build responsive React/Next.js features
- Collaborate with design and backend teams
- Improve performance and maintainability

Requirements:
- 3+ years of frontend experience
- Strong TypeScript and CSS skills
- Experience with component-driven development`;
