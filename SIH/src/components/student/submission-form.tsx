"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitChallenge } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Info, Loader2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const initialState = {
  message: "",
  status: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Submitting..." : "Submit for Review"}
    </Button>
  );
}

export function SubmissionForm({ challengeId, studentId, existingSubmission }: { challengeId: string, studentId: string, existingSubmission?: { submissionText: string, evidenceUrl: string } }) {
  const [formState, formAction] = useActionState(submitChallenge, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(existingSubmission?.evidenceUrl || null);

  useEffect(() => {
    if (formState.status === "success") {
      toast({
        title: "Submission Successful",
        description: formState.message,
      });
      formRef.current?.reset();
      setPreview(null);
    } else if (formState.status === "error") {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: formState.message,
      });
    }
  }, [formState, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setPreview(null);
    }
  };

  return (
    <Card>
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="challengeId" value={challengeId} />
        <input type="hidden" name="studentId" value={studentId} />
        <CardHeader>
          <CardTitle>Your Submission</CardTitle>
          <CardDescription>
            Provide your evidence to complete the challenge.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="submissionText">Notes / Description</Label>
            <Textarea
              id="submissionText"
              name="submissionText"
              placeholder="Describe what you did to complete the challenge..."
              required
              rows={4}
              defaultValue={existingSubmission?.submissionText}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="evidenceFile">Upload Evidence (Photo/Video)</Label>
            <Input id="evidenceFile" name="evidenceFile" type="file" accept="image/*,video/*" onChange={handleFileChange} />
            <p className="text-sm text-muted-foreground">
              Your upload will be analyzed by AI to assist with review.
            </p>
          </div>
          {preview && (
            <div className="mt-4">
              <Label>Preview</Label>
              <div className="mt-2 w-full aspect-video relative rounded-md overflow-hidden border">
                <Image src={preview} alt="Evidence preview" layout="fill" objectFit="contain" />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <SubmitButton />
          {formState.status === "success" && (
             <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">{formState.message}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
