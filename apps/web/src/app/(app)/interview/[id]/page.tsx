"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { interviewService } from "@/services/interviews";
import { ApiError } from "@/services/api";
import type {
  AnswerFeedback,
  InterviewDetail,
  SubmitAnswerResponse,
} from "@/types/interview";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_progress: "In Progress",
  completed: "Completed",
};

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
            err instanceof ApiError
              ? err.message
              : "Failed to load interview.";

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
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const currentAnswer = draftAnswers[currentIndex] ?? "";
  const currentSavedAnswer = savedAnswers[currentIndex];

  const answeredIndexes = useMemo(() => {
    return new Set(
      Object.keys(savedAnswers).map((index) => Number(index)),
    );
  }, [savedAnswers]);

  const answeredCount = answeredIndexes.size;
  const allQuestionsAnswered =
    totalQuestions > 0 && answeredCount === totalQuestions;
  const sessionProgressPercent = getSessionProgressPercent(
    currentIndex,
    totalQuestions,
  );
  const answeredProgressPercent = getAnsweredProgressPercent(
    answeredCount,
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

      if (interview.status === "draft") {
        setInterview((previous) =>
          previous ? { ...previous, status: "in_progress" } : previous,
        );
      }

      toast.success("Answer evaluated successfully.", {
        toastId: `answer-evaluated-${interviewId}-${currentIndex}`,
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to evaluate answer. Please try again.";

      toast.error(message, {
        toastId: `answer-error-${interviewId}-${currentIndex}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateReport = () => {
    toast.info("Final report generation is coming in the next task.", {
      toastId: `generate-report-${interviewId}`,
    });
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
        description={`${interview.companyName ?? "Company"} · ${statusLabels[interview.status] ?? interview.status} · ${totalQuestions} questions`}
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
          title={interview.title}
          companyName={interview.companyName}
          status={interview.status}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          currentQuestionNumber={currentIndex + 1}
          progressPercent={answeredProgressPercent}
          allQuestionsAnswered={allQuestionsAnswered}
          onGenerateReport={handleGenerateReport}
        />
      </div>
    </div>
  );
}
