"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Target,
  Trophy,
  Flame,
  Star,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge as UiBadge } from "@/components/ui/badge";

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

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [studentRank, setStudentRank] = useState<number | null>(null);
  const [activeChallenges, setActiveChallenges] = useState<any[]>([]);
  const [completedSubmissions, setCompletedSubmissions] = useState<any[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<any[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setStudent(parsedUser);

      // Load mock data
      import("@/lib/data").then(({ leaderboard, challenges, submissions, badges }) => {
        const rank = leaderboard.find((l) => l.student.id === parsedUser.id)?.rank;
        setStudentRank(rank);

        setActiveChallenges(challenges.slice(0, 2));

        const completed = submissions.filter(
          (s) => s.studentId === parsedUser.id && s.status === "Approved"
        );
        setCompletedSubmissions(completed);

        const earned = badges
          .filter((b) =>
            challenges.some(
              (c) =>
                c.badgeId === b.id &&
                completed.some((cs) => cs.challengeId === c.id)
            )
          )
          .slice(0, 3);
        setEarnedBadges(earned);
      });
    }
  }, []);

  if (!student) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Welcome back, {student.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">Here's your progress summary. Keep up the great work!</p>
        </div>
        <Button asChild>
          <Link href="/student/challenges">
            Find New Challenge <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Star} title="Total Points" value={student.points || 0} unit="pts" colorClass="text-yellow-500" />
        <StatCard icon={Trophy} title="Leaderboard Rank" value={`#${studentRank || 'N/A'}`} colorClass="text-green-500" />
        <StatCard icon={Flame} title="Current Streak" value={student.streak || 0} unit="days" colorClass="text-orange-500" />
        <StatCard icon={CheckCircle} title="Challenges Done" value={completedSubmissions.length} colorClass="text-blue-500" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Active Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeChallenges.map((challenge) => (
              <div key={challenge.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <h3 className="font-semibold">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground">{challenge.points} points</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/student/challenges/${challenge.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Recent Badges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {earnedBadges.length > 0 ? earnedBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-yellow-500/50">
                  <AvatarImage src={badge.iconUrl} alt={badge.title} data-ai-hint={badge.iconHint} />
                  <AvatarFallback>{badge.title.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{badge.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{badge.description}</p>
                </div>
              </div>
            )) : <p className="text-muted-foreground text-sm">Complete challenges to earn new badges!</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
