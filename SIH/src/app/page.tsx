import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, School } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center text-center mb-12">
        <Logo className="h-16 w-16 mb-4 text-primary" />
        <h1 className="text-5xl font-bold font-headline tracking-tighter text-foreground">
          Welcome to EcoSphere
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Turn your green actions into points, badges, and real-world impact. Join a community of learners and educators making a difference.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl">
          <CardHeader className="items-center text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">For Students</CardTitle>
            <CardDescription>
              Login to start challenges, earn points, and climb the leaderboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href="/student-login">Student Login</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl">
          <CardHeader className="items-center text-center">
             <div className="p-4 bg-accent/10 rounded-full mb-4">
              <School className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-2xl font-headline">For Educators</CardTitle>
            <CardDescription>
              Login to create challenges, review submissions, and track progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full md:w-auto">
              <Link href="/educator-login">Educator Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} EcoSphere. Let's make the world greener, together.</p>
      </footer>
    </div>
  );
}
