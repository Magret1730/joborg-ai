"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { PageHeader } from "@/components/layout/PageHeader";
import { AnswerForm } from "@/components/interviews/AnswerForm";
import { InterviewSessionSidebar } from "@/components/interviews/InterviewSessionSidebar";
import { QuestionCard } from "@/components/interviews/QuestionCard";
import { QuestionNavigator } from "@/components/interviews/QuestionNavigator";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { interviewService } from "@/services/interviews";
import { ApiError } from "@/services/api";
import type { InterviewDetail } from "@/types/interview";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  in_progress: "In Progress",
  completed: "Completed",
};

function getProgressPercent(currentIndex: number, totalQuestions: number) {
  if (totalQuestions === 0) {
    return 0;
  }

  return Math.round(((currentIndex + 1) / totalQuestions) * 100);
}

export default function InterviewPage() {
  const params = useParams<{ id: string }>();
  const interviewId = params.id;

  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draftAnswers, setDraftAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    let isMounted = true;

    async function loadInterview() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await interviewService.getById(interviewId);

        if (isMounted) {
          setInterview(data);
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

  const answeredIndexes = useMemo(() => {
    return new Set(
      Object.entries(draftAnswers)
        .filter(([, answer]) => answer.trim().length > 0)
        .map(([index]) => Number(index)),
    );
  }, [draftAnswers]);

  const answeredCount = answeredIndexes.size;
  const progressPercent = getProgressPercent(currentIndex, totalQuestions);

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

  const handleSubmitAnswer = () => {
    toast.info("Answer evaluation is coming in the next task.");
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
            <Link href="/history">
              <Button variant="secondary" className="w-full sm:w-auto">
                <FiArrowLeft size={16} />
                Back to History
              </Button>
            </Link>
            <Link href="/start">
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
            progressPercent={progressPercent}
          />

          <AnswerForm
            value={currentAnswer}
            onChange={updateAnswer}
            onClear={clearAnswer}
            onSubmit={handleSubmitAnswer}
          />

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
          progressPercent={progressPercent}
        />
      </div>
    </div>
  );
}
