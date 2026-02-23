import { AnalyzeEvidenceOutput } from "@/ai/flows/analyze-evidence-with-gen-ai";

export type UserRole = "student" | "educator";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  points: number;
  level: number;
  streak: number;
  rank?: number;
  educatorId?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  iconHint: string;
}

export type SubmissionStatus = "Pending" | "Approved" | "Rejected";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  points: number;
  deadline: string;
  badgeId?: string;
  imageUrl: string;
  imageHint: string;
  createdBy: string; // Educator user ID
}

export interface Submission {
  id: string;
  challengeId: string;
  studentId: string;
  submissionText: string;
  evidenceUrl: string; // Could be a photo or video URL, or data URI for new submissions
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  feedback?: string;
  aiAnalysis?: AnalyzeEvidenceOutput;
}

export interface LearningResource {
  id: string;
  title: string;
  content: string;
}

export interface LeaderboardEntry {
  rank: number;
  student: User;
  points: number;
}

    