import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Challenge from '@/lib/models/Challenge';

export async function GET() {
  await dbConnect();
  const challenges = await Challenge.find({});
  return NextResponse.json(challenges);
}
