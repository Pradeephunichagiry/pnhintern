"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, FileCheck2, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

function StatCard({ icon: Icon, title, value, unit, colorClass }: { icon: React.ElementType, title: string, value: string | number, unit?: string, colorClass: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function EducatorDashboard() {
  const [educator, setEducator] = useState<any>(null);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setEducator(parsedUser);

      // Load mock data
      import("@/lib/data").then(({ users: mockUsers, challenges: mockChallenges, submissions }) => {
        setUsers(mockUsers);
        setChallenges(mockChallenges);
        setStudentCount(mockUsers.filter((u) => u.role === "student").length);
        setPendingSubmissions(submissions.filter((s) => s.status === "Pending"));
      });
    }
  }, []);

  if (!educator) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Welcome, {educator.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">Here's an overview of your community's progress.</p>
        </div>
        <Button asChild>
          <Link href="/educator/challenges">
            Manage Challenges <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Clock} title="Pending Submissions" value={pendingSubmissions.length} colorClass="text-orange-500" />
        <StatCard icon={Users} title="Active Students" value={studentCount} colorClass="text-blue-500" />
        <StatCard icon={FileCheck2} title="Total Submissions" value={pendingSubmissions.length + 5} colorClass="text-green-500" /> {/* Mock total */}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions for Review</CardTitle>
            <CardDescription>The latest student submissions that need your attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Challenge</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSubmissions.slice(0, 5).map(submission => {
                  const student = users.find(u => u.id === submission.studentId);
                  const challenge = challenges.find(c => c.id === submission.challengeId);
                  return (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={student?.avatarUrl} />
                            <AvatarFallback>{student?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{student?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{challenge?.title}</TableCell>
                      <TableCell>{formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href="/educator/submissions">Review</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {pendingSubmissions.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">No pending submissions. Great job!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
