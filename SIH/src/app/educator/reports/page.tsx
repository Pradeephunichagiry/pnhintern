import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { users, submissions, leaderboard } from "@/lib/data";
import { LineChart, Download, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const currentUserId = "user-1"; // Example, not relevant for educator view but used in mock data

export default function ReportsPage() {

  const getStudentStats = (studentId: string) => {
    const studentSubmissions = submissions.filter(s => s.studentId === studentId);
    const approved = studentSubmissions.filter(s => s.status === 'Approved').length;
    const pending = studentSubmissions.filter(s => s.status === 'Pending').length;
    const rejected = studentSubmissions.filter(s => s.status === 'Rejected').length;
    return { approved, pending, rejected, total: studentSubmissions.length };
  }
  
  const studentData = users.filter(u => u.role === 'student');

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
            <LineChart className="w-8 h-8 text-primary"/>
            <div>
            <h1 className="text-3xl font-bold font-headline">Reports & Analytics</h1>
            <p className="text-muted-foreground">Track performance and view leaderboards.</p>
            </div>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Reports
        </Button>
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="performance">Student Performance</TabsTrigger>
          <TabsTrigger value="leaderboard">Class Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="performance">
          <Card className="mt-4">
             <CardHeader>
                <CardTitle>Student-wise Performance</CardTitle>
                <CardDescription>An overview of each student's submission history.</CardDescription>
             </CardHeader>
             <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Total Submissions</TableHead>
                            <TableHead>Approved</TableHead>
                            <TableHead>Pending</TableHead>
                            <TableHead>Rejected</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentData.map(student => {
                            const stats = getStudentStats(student.id);
                            return (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={student.avatarUrl} />
                                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{student.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{stats.total}</TableCell>
                                    <TableCell className="text-green-600 font-medium">{stats.approved}</TableCell>
                                    <TableCell className="text-blue-600 font-medium">{stats.pending}</TableCell>
                                    <TableCell className="text-red-600 font-medium">{stats.rejected}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
             </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leaderboard">
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Class Leaderboard</CardTitle>
                    <CardDescription>Top performing students based on points earned.</CardDescription>
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
                            <TableRow key={entry.student.id} className={cn(entry.student.id === currentUserId && "bg-primary/5")}>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
