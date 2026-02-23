"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface SubmissionReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string;
  studentName: string;
  challengeTitle: string;
  evidenceUrl?: string;
  onReviewComplete: () => void;
}

export function SubmissionReviewDialog({
  isOpen,
  onClose,
  submissionId,
  studentName,
  challengeTitle,
  evidenceUrl,
  onReviewComplete,
}: SubmissionReviewDialogProps) {
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (score === "" || feedback.trim() === "") {
      alert("Please provide both score and feedback.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/submissions/${submissionId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score,
          feedback,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
      onReviewComplete();
      onClose();
    } catch (error) {
      alert("Error submitting review: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Submission</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <strong>Student:</strong> {studentName}
          </p>
          <p>
            <strong>Challenge:</strong> {challengeTitle}
          </p>
          {evidenceUrl && (
            <div>
              <strong>Evidence:</strong>
              <div className="mt-2">
                <img src={evidenceUrl} alt="Evidence" className="max-w-full max-h-64 object-contain rounded-md border" />
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="score">Score (0-100)</Label>
            <input
              id="score"
              type="number"
              min={0}
              max={100}
              value={score}
              onChange={(e) => setScore(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
          <div>
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide feedback to the student"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
