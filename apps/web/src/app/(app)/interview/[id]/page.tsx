"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiChevronLeft, FiChevronRight, FiSend } from "react-icons/fi";
import { TextArea } from "@heroui/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeedbackCard } from "@/components/interviews/FeedbackCard";
import { QuestionCard } from "@/components/interviews/QuestionCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  getInterviewById,
  mockFeedback,
  mockQuestions,
} from "@/data/mockInterviews";

export default function InterviewPage() {
  const params = useParams<{ id: string }>();
  const interviewId = params.id;
  const interview = getInterviewById(interviewId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = mockQuestions[currentIndex];
  const isLastQuestion = currentIndex === mockQuestions.length - 1;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={interview?.jobTitle ?? "Mock Interview"}
        description={
          interview
            ? `${interview.company} · Practice session`
            : "Practice session"
        }
      />

      <QuestionCard
        questionNumber={currentIndex + 1}
        totalQuestions={mockQuestions.length}
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
              onClick={() => setShowFeedback(true)}
              disabled={!answer.trim()}
            >
              <FiSend size={16} />
              Submit Answersss
            </Button>
            <Button
              onClick={() =>
                setCurrentIndex((index) =>
                  Math.min(index + 1, mockQuestions.length - 1),
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

      {showFeedback && <FeedbackCard feedback={mockFeedback} />}

      {isLastQuestion && (
        <div className="flex justify-end">
          <Link href={`/interview/${interviewId}/report`}>
            <Button>View Report</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
