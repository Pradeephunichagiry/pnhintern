"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUserId(parsedUser.id);
    }

    fetch("/api/users")
      .then((res) => res.json())
      .then((students) => {
        const leaderboardData = students.map((student, index) => ({
          rank: index + 1,
          student,
          points: student.points,
        }));
        setLeaderboard(leaderboardData);
      })
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold font-headline">Leaderboard</h1>
          <p className="text-muted-foreground">See how you stack up against your peers!</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="text-center">Level</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry) => (
                <TableRow key={entry.student.id} className={cn(entry.student.id === currentUserId && "bg-primary/10")}>
                  <TableCell className="font-bold text-lg text-center">
                    {entry.rank === 1 && '🥇'}
                    {entry.rank === 2 && '🥈'}
                    {entry.rank === 3 && '🥉'}
                    {entry.rank > 3 && entry.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={entry.student.avatarUrl} alt={entry.student.name} />
                        <AvatarFallback>{entry.student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{entry.student.name}</span>
                      {entry.student.id === currentUserId && <Badge variant="outline">You</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{`Lv. ${entry.student.level}`}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    <div className="flex items-center justify-end gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {entry.points.toLocaleString()}
                    </div>
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
