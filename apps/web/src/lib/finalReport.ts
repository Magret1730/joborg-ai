import type { FinalReportResponse } from "@/types/interview";

export type FinalReportVerdictStyle = {
  label: string;
  className: string;
};

const verdictStyles: Record<string, FinalReportVerdictStyle> = {
  Ready: {
    label: "Interview Ready",
    className: "bg-[var(--success-soft)] text-[var(--success-text)]",
  },
  "Almost Ready": {
    label: "Almost Ready",
    className: "bg-[var(--info-soft)] text-[var(--info-text)]",
  },
  "Needs More Practice": {
    label: "Needs More Practice",
    className: "bg-[var(--warning-soft)] text-[var(--warning-text)]",
  },
};

const defaultVerdictStyle: FinalReportVerdictStyle = {
  label: "Report Ready",
  className: "bg-[var(--surface-hover)] text-[var(--muted)]",
};

export function getFinalReportVerdictStyle(
  verdict: string,
): FinalReportVerdictStyle {
  return verdictStyles[verdict] ?? { ...defaultVerdictStyle, label: verdict };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function parseFinalReport(value: unknown): FinalReportResponse | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const report = value as Record<string, unknown>;

  if (
    typeof report.overallScore !== "number" ||
    typeof report.technicalScore !== "number" ||
    typeof report.communicationScore !== "number" ||
    typeof report.readinessScore !== "number" ||
    !isStringArray(report.strengths) ||
    !isStringArray(report.weaknesses) ||
    !isStringArray(report.recommendations) ||
    typeof report.summary !== "string" ||
    typeof report.verdict !== "string"
  ) {
    return null;
  }

  return {
    overallScore: report.overallScore,
    technicalScore: report.technicalScore,
    communicationScore: report.communicationScore,
    readinessScore: report.readinessScore,
    strengths: report.strengths,
    weaknesses: report.weaknesses,
    recommendations: report.recommendations,
    summary: report.summary,
    verdict: report.verdict,
  };
}
