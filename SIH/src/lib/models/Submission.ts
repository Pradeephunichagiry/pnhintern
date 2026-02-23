import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
  id: string;
  challengeId: string;
  studentId: string;
  submissionText: string;
  evidenceUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  reviewedAt?: string;
  feedback?: string;
  score?: number;
  aiAnalysis?: {
    isComplete: boolean;
    confidence: number;
    flaggedIssues: string[];
    feedback: string;
  };
}

const SubmissionSchema: Schema<ISubmission> = new Schema({
  id: { type: String, required: true, unique: true },
  challengeId: { type: String, required: true },
  studentId: { type: String, required: true },
  submissionText: { type: String, required: true },
  evidenceUrl: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], required: true },
  submittedAt: { type: String, required: true },
  reviewedAt: { type: String },
  feedback: { type: String },
  score: { type: Number },
  aiAnalysis: {
    isComplete: { type: Boolean },
    confidence: { type: Number },
    flaggedIssues: [{ type: String }],
    feedback: { type: String },
  },
});

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
