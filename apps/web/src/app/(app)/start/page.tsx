"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiZap } from "react-icons/fi";
import { toast } from "react-toastify";
import { Input, TextArea } from "@heroui/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { exampleJobDescription } from "@/data/mockInterviews";
import { interviewService } from "@/services/interviews";
import { ApiError } from "@/services/api";

export default function StartInterviewPage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast.error("Job description is required.");
      return;
    }

    setIsGenerating(true);

    try {
      const result = await interviewService.generate({
        title: jobTitle.trim(),
        companyName: companyName.trim(),
        jobDescription: jobDescription.trim(),
      });

      toast.success("Interview created successfully!");
      router.push(`/interview/${result.interviewId}`);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to generate interview. Please try again.";

      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const fillExample = () => {
    setJobTitle("Frontend Engineer");
    setCompanyName("Stripe");
    setJobDescription(exampleJobDescription);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="Start Interview"
        description="Add the role details below. Joborg AI will generate a tailored mock interview from your job description."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card padding="lg" className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="job-title" className="text-sm font-medium text-[var(--text)]">
              Job title
            </label>
            <Input
              id="job-title"
              fullWidth
              variant="secondary"
              placeholder="e.g. Frontend Engineer"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="company-name" className="text-sm font-medium text-[var(--text)]">
              Company name
            </label>
            <Input
              id="company-name"
              fullWidth
              variant="secondary"
              placeholder="e.g. Stripe"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="job-description"
              className="text-sm font-medium text-[var(--text)]"
            >
              Job description
            </label>
            <TextArea
              id="job-description"
              fullWidth
              variant="secondary"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              className="min-h-48"
              disabled={isGenerating}
            />
          </div>

          <Button
            className="w-full sm:w-auto cursor-pointer"
            onClick={handleGenerate}
            disabled={
              isGenerating || !jobTitle || !companyName || !jobDescription.trim()
            }
          >
            {isGenerating ? (
              <>
                <Spinner size="sm" />
                Generating...
              </>
            ) : (
              <>
                <FiZap size={16} />
                Generate Interview
              </>
            )}
          </Button>
        </Card>

        <Card padding="lg" className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--text)]">
            Example job description
          </h3>
          <p className="text-sm text-[var(--muted)]">
            Not sure what to paste? Use this sample to preview the flow.
          </p>
          <pre className="overflow-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-xs leading-relaxed text-[var(--text-soft)] whitespace-pre-wrap">
            {exampleJobDescription}
          </pre>
          <Button
            variant="secondary"
            onClick={fillExample}
            className="w-full cursor-pointer"
            disabled={isGenerating}
          >
            Use example
          </Button>
        </Card>
      </div>
    </div>
  );
}
