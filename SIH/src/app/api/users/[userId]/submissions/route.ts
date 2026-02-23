import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Submission from '@/lib/models/Submission';

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  await dbConnect();
  const { userId } = await params;
  const submissions = await Submission.find({ studentId: userId });
  return NextResponse.json(submissions);
}
