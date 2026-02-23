import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Submission from "@/lib/models/Submission";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submissionId = id;
  console.log("POST /api/submissions/[id]/review called with params:", params);
  console.log("submissionId:", submissionId);
  const body = await request.json();
  console.log("Request body:", body);
  const { score, feedback } = body;

  if (typeof score !== "number" || !feedback || typeof feedback !== "string") {
    console.log("Invalid input validation failed");
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    await dbConnect();
    console.log("Connected to DB");

    // Use findOneAndUpdate with filter on id field to match schema
    const updatedSubmission = await Submission.findOneAndUpdate(
      { id: submissionId },
      {
        status: score >= 50 ? "Approved" : "Rejected",
        feedback,
        score,
        reviewedAt: new Date().toISOString(),
      },
      { new: true, runValidators: true }
    );
    console.log("Updated submission:", updatedSubmission);

    if (!updatedSubmission) {
      console.log("Submission not found");
      return NextResponse.json({ message: "Submission not found or failed to update" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review saved successfully" });
  } catch (error) {
    console.error("Error saving review:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
