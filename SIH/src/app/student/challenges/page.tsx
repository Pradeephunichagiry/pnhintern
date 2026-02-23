"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Challenge, SubmissionStatus, Submission } from "@/lib/types";
import { CheckCircle, Clock, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const studentId = 'user-1';

const getChallengeStatus = (challengeId: string, submissions: Submission[]): { status: SubmissionStatus | "Available", inProgress: boolean } => {
  const submission = submissions.find(s => s.studentId === studentId && s.challengeId === challengeId);
  if (submission) {
    return { status: submission.status, inProgress: submission.status === 'Pending' };
  }
  return { status: "Available", inProgress: false };
}

const ChallengeCard = ({ challenge, submissions }: { challenge: Challenge, submissions: Submission[] }) => {
  const { status, inProgress } = getChallengeStatus(challenge.id, submissions);
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={challenge.imageUrl}
            alt={challenge.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint={challenge.imageHint}
          />
          <Badge 
            variant={status === 'Approved' ? 'default' : status === 'Pending' ? 'secondary' : 'outline'}
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
          >
            {status === 'Approved' && <CheckCircle className="w-4 h-4 mr-1 text-green-500" />}
            {status === 'Pending' && <Clock className="w-4 h-4 mr-1 text-blue-500" />}
            {status}
          </Badge>
        </div>
        <div className="p-6 pb-2">
          <CardTitle className="font-headline text-xl">{challenge.title}</CardTitle>
          <CardDescription className="mt-2 line-clamp-2">{challenge.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-2">
        <div className="text-lg font-bold text-primary">{challenge.points} Points</div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/student/challenges/${challenge.id}`}>
            {inProgress ? "Continue Challenge" : "View Challenge"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      const challengesRes = await fetch('/api/challenges');
      const challengesData: Challenge[] = await challengesRes.json();
      setChallenges(challengesData);

      const submissionsRes = await fetch('/api/submissions');
      const submissionsData: Submission[] = await submissionsRes.json();
      setSubmissions(submissionsData);
    }
    fetchData();
  }, []);

  const studentSubmissions = submissions.filter(s => s.studentId === studentId);
  const inProgressChallenges = challenges.filter(c => studentSubmissions.some(s => s.challengeId === c.id && s.status === 'Pending'));
  const completedChallenges = challenges.filter(c => studentSubmissions.some(s => s.challengeId === c.id && s.status === 'Approved'));
  const availableChallenges = challenges.filter(c => !studentSubmissions.some(s => s.challengeId === c.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ListChecks className="w-8 h-8 text-primary"/>
        <div>
          <h1 className="text-3xl font-bold font-headline">Eco-Challenges</h1>
          <p className="text-muted-foreground">Accept challenges, complete tasks, and earn points.</p>
        </div>
      </div>
      
      <Tabs defaultValue="available">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {availableChallenges.map(challenge => <ChallengeCard key={challenge.id} challenge={challenge} submissions={submissions} />)}
          </div>
          {availableChallenges.length === 0 && <p className="text-center text-muted-foreground mt-8">No new challenges available. Check back soon!</p>}
        </TabsContent>
        <TabsContent value="in-progress">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {inProgressChallenges.map(challenge => <ChallengeCard key={challenge.id} challenge={challenge} submissions={submissions} />)}
          </div>
          {inProgressChallenges.length === 0 && <p className="text-center text-muted-foreground mt-8">You have no challenges in progress.</p>}
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {completedChallenges.map(challenge => <ChallengeCard key={challenge.id} challenge={challenge} submissions={submissions} />)}
          </div>
          {completedChallenges.length === 0 && <p className="text-center text-muted-foreground mt-8">You haven't completed any challenges yet.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
