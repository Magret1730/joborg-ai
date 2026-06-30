"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiChevronLeft, FiChevronRight, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import { TextArea } from "@heroui/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuestionCard } from "@/components/interviews/QuestionCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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

export default function InterviewPage() {
  const params = useParams<{ id: string }>();
  const interviewId = params.id;

  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");

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

  const handleSubmitAnswer = () => {
    toast.info("Answer evaluation is coming in the next task.");
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <LoadingState label="Loading interview..." rows={5} />
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <ErrorState
          title="Interview not found"
          message={error ?? "This interview could not be loaded."}
        />
      </div>
    );
  }

  const questions = interview.questions;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  if (!currentQuestion) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <ErrorState
          title="No questions found"
          message="This interview does not have any questions yet."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={interview.title}
        description={`${interview.companyName ?? "Company"} · ${statusLabels[interview.status] ?? interview.status}`}
      />

      <QuestionCard
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        type={currentQuestion.type}
        question={currentQuestion.question}
      />

      <Card padding="lg" className="space-y-4">
        <label htmlFor="answer" className="text-sm font-medium text-[var(--text)]">
          Your answer
        </label>
        <TextArea
          id="answer"
          fullWidth
          variant="secondary"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          className="min-h-40"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="secondary"
            onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
            disabled={currentIndex === 0}
          >
            <FiChevronLeft size={16} />
            Previous
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="secondary"
              onClick={handleSubmitAnswer}
              disabled={!answer.trim()}
            >
              <FiSend size={16} />
              Submit Answer
            </Button>
            <Button
              onClick={() =>
                setCurrentIndex((index) =>
                  Math.min(index + 1, questions.length - 1),
                )
              }
              disabled={isLastQuestion}
            >
              Next
              <FiChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
