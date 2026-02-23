"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Challenge, Submission } from "@/lib/types";

export default function EducatorChallengesPage() {
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

  const getSubmissionCount = (challengeId: string) => {
    return submissions.filter(s => s.challengeId === challengeId).length;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Challenge Management</h1>
          <p className="text-muted-foreground">Create, edit, and oversee all eco-challenges.</p>
        </div>
        <Button asChild>
          <Link href="/educator/challenges/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Challenge
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Challenges</CardTitle>
          <CardDescription>View and manage all challenges you have created.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map(challenge => (
                <TableRow key={challenge.id}>
                  <TableCell className="font-medium">{challenge.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{challenge.points}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(challenge.deadline), "MMMM d, yyyy")}</TableCell>
                  <TableCell>{getSubmissionCount(challenge.id)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                           <Link href={`/educator/challenges/${challenge.id}`}>View / Edit</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
