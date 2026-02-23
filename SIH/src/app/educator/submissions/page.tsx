"use client";

import * as React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Submission, User, Challenge } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Clock, XCircle, FileCheck2 } from "lucide-react";
import { SubmissionReviewDialog } from "@/components/educator/submission-review-dialog";

type SubmissionWithData = Submission & {
  student: User | null;
  challenge: Challenge | null;
};

const SubmissionRow = ({
  submission,
  onReviewClick,
}: {
  submission: SubmissionWithData;
  onReviewClick: (submission: SubmissionWithData) => void;
}) => {
  const { student, challenge } = submission;

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={student?.avatarUrl || ""} />
            <AvatarFallback>{student?.name?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{student?.name || "Unknown Student"}</span>
        </div>
      </TableCell>
      <TableCell>{challenge?.title || "Unknown Challenge"}</TableCell>
      <TableCell>{formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}</TableCell>
      <TableCell>
        <Badge
          variant={
            submission.status === "Approved"
              ? "default"
              : submission.status === "Rejected"
              ? "destructive"
              : "secondary"
          }
          className="capitalize"
        >
          {submission.status === "Approved" && <CheckCircle className="mr-1 h-3 w-3" />}
          {submission.status === "Pending" && <Clock className="mr-1 h-3 w-3" />}
          {submission.status === "Rejected" && <XCircle className="mr-1 h-3 w-3" />}
          {submission.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" onClick={() => onReviewClick(submission)}>
          Review
        </Button>
      </TableCell>
    </TableRow>
  );
};

const SubmissionsTable = ({
  submissions,
  status,
  onReviewClick,
}: {
  submissions: SubmissionWithData[] | undefined;
  status: "Pending" | "Approved" | "Rejected";
  onReviewClick: (submission: SubmissionWithData) => void;
}) => {
  if (!submissions) {
    return <p className="text-center text-muted-foreground py-8">Loading submissions...</p>;
  }

  const filteredSubmissions = submissions.filter((s) => s.status === status);

  if (filteredSubmissions.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No {status.toLowerCase()} submissions.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Challenge</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredSubmissions.map((submission) => (
          <SubmissionRow key={submission.id} submission={submission} onReviewClick={onReviewClick} />
        ))}
      </TableBody>
    </Table>
  );
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = React.useState<SubmissionWithData[] | undefined>(undefined);
  const [selectedSubmission, setSelectedSubmission] = React.useState<SubmissionWithData | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    async function fetchSubmissions() {
      const res = await fetch("/api/submissions", { cache: "no-store" });
      if (res.ok) {
        const data: SubmissionWithData[] = await res.json();
        setSubmissions(data);
      } else {
        setSubmissions([]);
      }
    }
    fetchSubmissions();
  }, []);

  function handleReviewClick(submission: SubmissionWithData) {
    setSelectedSubmission(submission);
    setDialogOpen(true);
  }

  function handleReviewComplete() {
    // Refresh submissions after review
    setDialogOpen(false);
    setSelectedSubmission(null);
    async function refresh() {
      const res = await fetch("/api/submissions", { cache: "no-store" });
      if (res.ok) {
        const data: SubmissionWithData[] = await res.json();
        setSubmissions(data);
      }
    }
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <FileCheck2 className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline">Review Submissions</h1>
          <p className="text-muted-foreground">Approve or reject student submissions and provide feedback.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>Select a tab to view submissions by status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <SubmissionsTable submissions={submissions} status="Pending" onReviewClick={handleReviewClick} />
            </TabsContent>
            <TabsContent value="approved">
              <SubmissionsTable submissions={submissions} status="Approved" onReviewClick={handleReviewClick} />
            </TabsContent>
            <TabsContent value="rejected">
              <SubmissionsTable submissions={submissions} status="Rejected" onReviewClick={handleReviewClick} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedSubmission && (
        <SubmissionReviewDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          submissionId={selectedSubmission.id}
          studentName={selectedSubmission.student?.name || "Unknown Student"}
          challengeTitle={selectedSubmission.challenge?.title || "Unknown Challenge"}
          evidenceUrl={selectedSubmission.evidenceUrl}
          onReviewComplete={handleReviewComplete}
        />
      )}
    </div>
  );
}
