import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Submission from '@/lib/models/Submission';
import User from '@/lib/models/User';
import Challenge from '@/lib/models/Challenge';

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const submissions = await Submission.find({}).lean();

    const submissionsWithData = await Promise.all(
      submissions.map(async (submission) => {
        const user = await User.findOne({ id: submission.studentId }).lean();
        const challenge = await Challenge.findOne({ id: submission.challengeId }).lean();

        return {
          id: submission.id,
          challengeId: submission.challengeId,
          studentId: submission.studentId,
          submissionText: submission.submissionText,
          evidenceUrl: submission.evidenceUrl,
          status: submission.status,
          submittedAt: submission.submittedAt,
          reviewedAt: submission.reviewedAt,
          feedback: submission.feedback,
          aiAnalysis: submission.aiAnalysis,
          student: user ? {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            role: user.role,
            points: user.points,
            level: user.level,
            streak: user.streak,
          } : null,
          challenge: challenge ? {
            id: challenge.id,
            title: challenge.title,
            description: challenge.description,
            whyItMatters: challenge.whyItMatters,
            points: challenge.points,
            deadline: challenge.deadline,
            badgeId: challenge.badgeId,
            imageUrl: challenge.imageUrl,
            imageHint: challenge.imageHint,
            createdBy: challenge.createdBy,
          } : null,
        };
      })
    );

    return NextResponse.json(submissionsWithData);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
