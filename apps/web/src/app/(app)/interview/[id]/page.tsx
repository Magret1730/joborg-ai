"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { PageHeader } from "@/components/layout/PageHeader";
import { AnswerForm } from "@/components/interviews/AnswerForm";
import { FeedbackCard } from "@/components/interviews/FeedbackCard";
import { FeedbackLoadingCard } from "@/components/interviews/FeedbackLoadingCard";
import { InterviewSessionSidebar } from "@/components/interviews/InterviewSessionSidebar";
import { QuestionCard } from "@/components/interviews/QuestionCard";
import { QuestionNavigator } from "@/components/interviews/QuestionNavigator";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { getFriendlyErrorMessage } from "@/lib/errorMessages";
import { interviewService } from "@/services/interviews";
import { ApiError } from "@/services/api";
import type {
  AnswerFeedback,
  InterviewDetail,
  SubmitAnswerResponse,
} from "@/types/interview";
import { getSessionStatusLabel } from "@/lib/interviewProgress";
import { parseFinalReport } from "@/lib/finalReport";

type SavedAnswerState = {
  answerText: string;
  score: number;
  feedback: AnswerFeedback;
};

function getSessionProgressPercent(
  currentIndex: number,
  totalQuestions: number,
) {
  if (totalQuestions === 0) {
    return 0;
  }

  return Math.round(((currentIndex + 1) / totalQuestions) * 100);
}

function getAnsweredProgressPercent(
  answeredCount: number,
  totalQuestions: number,
) {
  if (totalQuestions === 0) {
    return 0;
  }

  return Math.round((answeredCount / totalQuestions) * 100);
}

function buildAnsweredIndexes(savedAnswers: Record<number, SavedAnswerState>) {
  return new Set(Object.keys(savedAnswers).map((index) => Number(index)));
}

function isAnswerFeedback(value: unknown): value is AnswerFeedback {
  if (!value || typeof value !== "object") {
    return false;
  }

  const feedback = value as Record<string, unknown>;

  return (
    Array.isArray(feedback.strengths) &&
    Array.isArray(feedback.weaknesses) &&
    typeof feedback.improvedAnswer === "string" &&
    typeof feedback.followUpQuestion === "string" &&
    typeof feedback.shortFeedback === "string"
  );
}

function hydrateFromInterview(interview: InterviewDetail) {
  const draftAnswers: Record<number, string> = {};
  const savedAnswers: Record<number, SavedAnswerState> = {};

  for (const answer of interview.answers) {
    draftAnswers[answer.questionIndex] = answer.answerText;

    if (answer.score !== null && isAnswerFeedback(answer.feedback)) {
      savedAnswers[answer.questionIndex] = {
        answerText: answer.answerText,
        score: answer.score,
        feedback: answer.feedback,
      };
    }
  }

  return { draftAnswers, savedAnswers };
}

export default function InterviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const interviewId = params.id;

  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draftAnswers, setDraftAnswers] = useState<Record<number, string>>({});
  const [savedAnswers, setSavedAnswers] = useState<
    Record<number, SavedAnswerState>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadInterview() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await interviewService.getById(interviewId);

        if (isMounted) {
          const hydrated = hydrateFromInterview(data);
          setInterview(data);
          setDraftAnswers(hydrated.draftAnswers);
          setSavedAnswers(hydrated.savedAnswers);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof ApiError && err.status === 404
              ? "This interview could not be found. It may have been deleted."
              : getFriendlyErrorMessage(
                  err,
                  "We couldn't load this interview. Please try again in a moment.",
                );
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInterview();

    return () => {
      isMounted = false;
    };
  }, [interviewId]);

  const questions = interview?.questions ?? [];
  const totalQuestions = interview?.questionCount ?? questions.length;
  const currentQuestion = questions[currentIndex];
  const currentAnswer = draftAnswers[currentIndex] ?? "";
  const currentSavedAnswer = savedAnswers[currentIndex];

  const answeredIndexes = useMemo(
    () => buildAnsweredIndexes(savedAnswers),
    [savedAnswers],
  );

  const answeredCount = interview?.answeredCount ?? answeredIndexes.size;
  const progressPercentage =
    interview?.progressPercentage ??
    getAnsweredProgressPercent(answeredCount, totalQuestions);
  const readyForReport =
    interview?.readyForReport ??
    (totalQuestions > 0 && answeredCount === totalQuestions);
  const hasFinalReport = parseFinalReport(interview?.finalReport ?? null) !== null;
  const sessionProgressPercent = getSessionProgressPercent(
    currentIndex,
    totalQuestions,
  );

  const updateAnswer = (value: string) => {
    setDraftAnswers((previous) => ({
      ...previous,
      [currentIndex]: value,
    }));
  };

  const clearAnswer = () => {
    setDraftAnswers((previous) => ({
      ...previous,
      [currentIndex]: "",
    }));
  };

  const handleSubmitAnswer = async () => {
    if (!interview || !currentQuestion || !currentAnswer.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result: SubmitAnswerResponse = await interviewService.submitAnswer(
        interviewId,
        {
          questionIndex: currentIndex,
          questionText: currentQuestion.question,
          questionType: currentQuestion.type,
          answerText: currentAnswer.trim(),
          goodAnswerHints: currentQuestion.goodAnswerHints,
        },
      );

      setSavedAnswers((previous) => ({
        ...previous,
        [currentIndex]: {
          answerText: result.answerText,
          score: result.score,
          feedback: result.feedback,
        },
      }));

      setInterview((previous) =>
        previous
          ? {
              ...previous,
              status: result.status,
              answeredCount: result.answeredCount,
              questionCount: result.questionCount,
              progressPercentage: result.progressPercentage,
              readyForReport: result.readyForReport,
            }
          : previous,
      );

      toast.success("Answer evaluated successfully.", {
        toastId: `answer-evaluated-${interviewId}-${currentIndex}`,
      });
    } catch (err) {
      toast.error(
        getFriendlyErrorMessage(
          err,
          "We couldn't evaluate your answer. Please try again in a moment.",
        ),
        {
          toastId: `answer-error-${interviewId}-${currentIndex}`,
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!readyForReport || isGeneratingReport || hasFinalReport) {
      return;
    }

    setIsGeneratingReport(true);

    try {
      const report = await interviewService.generateFinalReport(interviewId);

      setInterview((previous) =>
        previous
          ? {
              ...previous,
              status: "completed",
              overallScore: report.overallScore,
              finalReport: report,
              readyForReport: true,
            }
          : previous,
      );

      toast.success("Final report generated successfully.", {
        toastId: `generate-report-${interviewId}`,
      });
      router.push(`/interview/${interviewId}/report`);
    } catch (err) {
      toast.error(
        getFriendlyErrorMessage(
          err,
          "We couldn't generate your final report. Please try again in a moment.",
        ),
        {
          toastId: `generate-report-error-${interviewId}`,
        },
      );
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((index) => Math.min(index + 1, totalQuestions - 1));
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <LoadingState label="Loading interview session..." rows={6} />
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <ErrorState
          title="Interview not found"
          message={error ?? "This interview could not be loaded."}
        />
      </div>
    );
  }

  if (!currentQuestion || totalQuestions === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <ErrorState
          title="No questions found"
          message="This interview does not have any questions yet."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title={interview.title}
        description={`${interview.companyName ?? "Company"} · ${getSessionStatusLabel(interview.status, readyForReport)} · ${totalQuestions} questions · ${progressPercentage}% complete`}
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/history" className="cursor-pointer">
              <Button variant="secondary" className="w-full sm:w-auto">
                <FiArrowLeft size={16} />
                Back to History
              </Button>
            </Link>
            <Link href="/start" className="cursor-pointer">
              <Button className="w-full sm:w-auto">
                <FiPlus size={16} />
                Start New Interview
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-6">
          <QuestionCard
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            type={currentQuestion.type}
            difficulty={currentQuestion.difficulty}
            question={currentQuestion.question}
            goodAnswerHints={currentQuestion.goodAnswerHints}
            progressPercent={sessionProgressPercent}
          />

          <AnswerForm
            value={currentAnswer}
            onChange={updateAnswer}
            onClear={clearAnswer}
            onSubmit={() => void handleSubmitAnswer()}
            isSubmitting={isSubmitting}
            hasSavedAnswer={Boolean(currentSavedAnswer)}
            savedScore={currentSavedAnswer?.score}
          />

          {isSubmitting ? (
            <FeedbackLoadingCard />
          ) : (
            currentSavedAnswer && (
              <FeedbackCard
                score={currentSavedAnswer.score}
                feedback={currentSavedAnswer.feedback}
              />
            )
          )}

          <QuestionNavigator
            totalQuestions={totalQuestions}
            currentIndex={currentIndex}
            answeredIndexes={answeredIndexes}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onSelect={goToQuestion}
          />
        </div>

        <InterviewSessionSidebar
          interviewId={interviewId}
          title={interview.title}
          companyName={interview.companyName}
          status={interview.status}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          currentQuestionNumber={currentIndex + 1}
          progressPercent={progressPercentage}
          readyForReport={readyForReport}
          hasFinalReport={hasFinalReport}
          isGeneratingReport={isGeneratingReport}
          onGenerateReport={() => void handleGenerateReport()}
        />
      </div>
    </div>
  );
}
