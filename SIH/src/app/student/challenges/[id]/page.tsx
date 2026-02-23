import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Star, Award, CheckCircle, Clock, XCircle } from "lucide-react";
import { SubmissionForm } from "@/components/student/submission-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Challenge, Submission, Badge } from "@/lib/types";

const studentId = 'user-1';

export default async function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [challengesRes, submissionsRes, badgesRes] = await Promise.all([
    fetch('http://localhost:9002/api/challenges'),
    fetch('http://localhost:9002/api/submissions'),
    fetch('http://localhost:9002/api/badges')
  ]);

  const challenges: Challenge[] = await challengesRes.json();
  const submissions: Submission[] = await submissionsRes.json();
  const badges: Badge[] = await badgesRes.json();

  const challenge = challenges.find((c) => c.id === id);

  if (!challenge) {
    notFound();
  }

  const submission = submissions.find(s => s.challengeId === challenge.id && s.studentId === studentId);
  const badge = badges.find(b => b.id === challenge.badgeId);

  const StatusAlert = () => {
    if (!submission) return null;

    if (submission.status === 'Pending') {
      return (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>Submission Pending</AlertTitle>
          <AlertDescription>Your submission is awaiting review from an educator. You can update your submission below.</AlertDescription>
        </Alert>
      )
    }
    if (submission.status === 'Approved') {
      return (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-green-800">Challenge Approved!</AlertTitle>
          <AlertDescription className="text-green-700">
            Great work! You've earned {challenge.points} points. {submission.feedback}
          </AlertDescription>
        </Alert>
      )
    }
    if (submission.status === 'Rejected') {
      return (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Needs Improvement</AlertTitle>
          <AlertDescription>
            Your submission was returned with feedback. Please review and resubmit.
            <p className="mt-2 font-semibold">Feedback: "{submission.feedback}"</p>
          </AlertDescription>
        </Alert>
      )
    }
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full h-64 rounded-lg overflow-hidden">
        <Image 
          src={challenge.imageUrl} 
          alt={challenge.title}
          layout="fill"
          objectFit="cover"
          className="bg-muted"
          data-ai-hint={challenge.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
           <h1 className="text-4xl font-bold font-headline text-white">{challenge.title}</h1>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{challenge.description}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/20">
             <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Lightbulb />
                Why It Matters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary/90">{challenge.whyItMatters}</p>
            </CardContent>
          </Card>
          
          <StatusAlert />

          {submission?.status !== 'Approved' && (
            <SubmissionForm 
              challengeId={challenge.id} 
              studentId={studentId} 
              existingSubmission={submission ? { submissionText: submission.submissionText, evidenceUrl: submission.evidenceUrl } : undefined}
            />
          )}

           {submission?.status === 'Approved' && (
             <Button asChild variant="outline" className="w-full">
              <Link href="/student/challenges">Back to Challenges</Link>
            </Button>
          )}

        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="font-semibold">{challenge.points} Points</p>
                  <p className="text-sm text-muted-foreground">Upon successful completion</p>
                </div>
              </div>
              {badge && (
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="font-semibold">{badge.title}</p>
                    <p className="text-sm text-muted-foreground">Unlock this badge</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
