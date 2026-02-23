"use server";

import mongoose from "mongoose";
import { analyzeEvidence } from "@/ai/flows/analyze-evidence-with-gen-ai";
import { revalidatePath } from "next/cache";
import dbConnect from "./mongodb";
import User from "./models/User";
import Challenge from "./models/Challenge";
import Submission from "./models/Submission";
import { Challenge as IChallenge, Submission as ISubmission } from "./types";
import { z } from "zod";
import { redirect } from "next/navigation";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function getUserFromToken(token?: string) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    await dbConnect();
    const user = await User.findOne({ id: decoded.id });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      points: user.points,
      level: user.level,
      streak: user.streak,
    };
  } catch (error) {
    return null;
  }
}

export async function submitChallenge(prevState: any, formData: FormData) {
  const challengeId = formData.get("challengeId") as string;
  const studentId = formData.get("studentId") as string;
  const submissionText = formData.get("submissionText") as string;
  const evidenceFile = formData.get("evidenceFile") as File;

  let evidenceDataUri = "";
  if (evidenceFile && evidenceFile.size > 0) {
    const arrayBuffer = await evidenceFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    evidenceDataUri = `data:${evidenceFile.type};base64,${buffer.toString("base64")}`;
  }

  await dbConnect();

  const challenge = await Challenge.findOne({ id: challengeId });
  if (!challenge) {
    return { message: "Challenge not found.", status: "error" };
  }

  let aiAnalysis = null;
  try {
    aiAnalysis = await analyzeEvidence({
      submissionText,
      evidenceDataUri: evidenceDataUri || undefined,
      challengeDescription: challenge.description,
    });
  } catch (error) {
    console.error("AI Analysis failed:", error);
    // Continue without AI analysis
  }

  const newSubmissionData = {
    id: new mongoose.Types.ObjectId().toString(),
    challengeId,
    studentId,
    submissionText,
    evidenceUrl: evidenceDataUri,
    status: 'Pending' as const,
    submittedAt: new Date().toISOString(),
    aiAnalysis,
  };

  const existingSubmission = await Submission.findOne({ challengeId, studentId });
  if (existingSubmission) {
    await Submission.findByIdAndUpdate(existingSubmission._id, newSubmissionData);
  } else {
    await Submission.create(newSubmissionData);
  }

  revalidatePath(`/student/challenges`);
  revalidatePath(`/student/challenges/${challengeId}`);
  revalidatePath(`/educator/submissions`);

  return { message: "Challenge submitted successfully! It is now pending review.", status: "success" };
}

export async function createChallenge(prevState: any, formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    console.log('Token in createChallenge:', token);

    if (!token) {
      console.log('No token found in cookies');
      return { message: 'Unauthorized', status: 'error' };
    }

    const user = await getUserFromToken(token);
    if (!user) {
      console.log('User not found for token');
      return { message: 'Unauthorized', status: 'error' };
    }

    await dbConnect();

    const newChallengeData = {
      id: new mongoose.Types.ObjectId().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      whyItMatters: formData.get("whyItMatters") as string,
      points: Number(formData.get("points")),
      deadline: new Date(formData.get("deadline") as string).toISOString(),
      badgeId: formData.get("badgeId") as string || undefined,
      imageUrl: 'https://picsum.photos/seed/newChallenge/600/400',
      imageHint: 'nature abstract',
      createdBy: user.id,
    };

    await Challenge.create(newChallengeData);
    revalidatePath('/educator/challenges');
    revalidatePath('/student/challenges');

    return { message: 'Challenge created successfully!', status: 'success' };
  } catch (e) {
    console.error(e);
    return { message: 'Failed to create challenge', status: 'error' };
  }
}

export async function updateUserProfile(prevState: any, formData: FormData) {
  try {
    await dbConnect();

    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    const user = await User.findById(userId);
    if (!user) {
      return { message: 'User not found', status: 'error' };
    }

    user.name = name;
    if (password) {
      user.password = password; // In real app, hash the password
    }
    await user.save();

    revalidatePath('/student/profile');
    revalidatePath('/educator/profile');

    return { message: 'Profile updated successfully!', status: 'success' };
  } catch (e) {
    console.error(e);
    return { message: 'Failed to update profile', status: 'error' };
  }
}
