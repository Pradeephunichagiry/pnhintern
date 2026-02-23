"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/lib/actions";
import { Award, Check, Flame, Star, Target, Edit } from "lucide-react";
import type { User, Submission, Challenge, Badge as BadgeType } from "@/lib/types";

export default function ProfilePage() {
  const [student, setStudent] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          window.location.href = '/student-login';
          return;
        }
        const user = JSON.parse(userStr);
        const userId = user.id;

        const [userRes, submissionsRes, challengesRes, badgesRes] = await Promise.all([
          fetch(`/api/user/${userId}`),
          fetch(`/api/submissions/${userId}`),
          fetch('/api/challenges'),
          fetch('/api/badges')
        ]);

        if (!userRes.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userRes.json();
        const submissionsData = await submissionsRes.json();
        const challengesData = await challengesRes.json();
        const badgesData = await badgesRes.json();

        setStudent(userData);
        setSubmissions(submissionsData);
        setChallenges(challengesData);
        setBadges(badgesData);
        setName(userData.name);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !student) {
    return <div>Loading...</div>;
  }

  const completedSubmissions = submissions.filter(s => s.status === 'Approved');
  const completedChallenges = challenges.filter(c => completedSubmissions.some(cs => cs.challengeId === c.id));
  const earnedBadges = badges.filter(b => completedChallenges.some(cc => cc.badgeId === b.id));

  const pointsForNextLevel = (student.level + 1) * 250;
  const progressToNextLevel = (student.points % 250) / 250 * 100;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('userId', student.id);
    await updateUserProfile(null, formData);
    setIsOpen(false);
    // Refresh data
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-primary">
            <AvatarImage src={student.avatarUrl} />
            <AvatarFallback className="text-4xl">{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold font-headline">{student.name}</h1>
              <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
            <p className="text-muted-foreground">Level {student.level} • {student.points} points</p>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress to Level {student.level + 1}</span>
                <span>{student.points % 250}/{250} pts</span>
              </div>
              <Progress value={progressToNextLevel} className="w-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <form onSubmit={handleSubmit} className={isOpen ? "block" : "hidden"}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Eco-CV</CardTitle>
          <CardDescription>Your portfolio of environmental achievements.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                Earned Badges ({earnedBadges.length})
              </h3>
              <div className="space-y-4">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={badge.iconUrl} data-ai-hint={badge.iconHint} />
                      <AvatarFallback>{badge.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{badge.title}</p>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
                {earnedBadges.length === 0 && <p className="text-sm text-muted-foreground">No badges earned yet. Complete challenges to get some!</p>}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-primary" />
                Completed Challenges ({completedChallenges.length})
              </h3>
              <div className="space-y-3">
                {completedChallenges.map(challenge => (
                  <div key={challenge.id} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{challenge.title}</p>
                      <p className="text-sm text-muted-foreground">+{challenge.points} pts</p>
                    </div>
                  </div>
                ))}
                {completedChallenges.length === 0 && <p className="text-sm text-muted-foreground">No challenges completed yet.</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
