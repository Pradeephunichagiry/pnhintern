import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Badge from '@/lib/models/Badge';

export async function GET() {
  await dbConnect();
  const badges = await Badge.find({});
  return NextResponse.json(badges);
}
