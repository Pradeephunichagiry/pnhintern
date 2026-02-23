'use server';
/**
 * @fileOverview Analyzes student submissions (photos, videos, text) for eco-challenge completion using GenAI.
 *
 * - analyzeEvidence - A function that analyzes the evidence and returns a report.
 * - AnalyzeEvidenceInput - The input type for the analyzeEvidence function.
 * - AnalyzeEvidenceOutput - The return type for the analyzeEvidence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEvidenceInputSchema = z.object({
  submissionText: z.string().describe('The text of the submission.'),
  evidenceDataUri: z
    .string()
    .describe(
      "A photo or video of the submission, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  challengeDescription: z.string().describe('The description of the eco-challenge.'),
});
export type AnalyzeEvidenceInput = z.infer<typeof AnalyzeEvidenceInputSchema>;

const AnalyzeEvidenceOutputSchema = z.object({
  isComplete: z.boolean().describe('Whether or not the submission is likely to be complete.'),
  confidence: z.number().describe('A number between 0 and 1 indicating how confident the analysis is.'),
  flaggedIssues: z.array(z.string()).describe('A list of potential issues with the submission.'),
  feedback: z.string().describe('Feedback for the student on how to improve their submission.'),
});
export type AnalyzeEvidenceOutput = z.infer<typeof AnalyzeEvidenceOutputSchema>;

export async function analyzeEvidence(input: AnalyzeEvidenceInput): Promise<AnalyzeEvidenceOutput> {
  return analyzeEvidenceFlow(input);
}

const analyzeEvidencePrompt = ai.definePrompt({
  name: 'analyzeEvidencePrompt',
  input: {schema: AnalyzeEvidenceInputSchema},
  output: {schema: AnalyzeEvidenceOutputSchema},
  prompt: `You are an AI assistant that analyzes student submissions for eco-challenges.

You will be given a description of the challenge, the student's submission text, and optionally a photo or video of the submission.

You must determine whether the submission is likely to be complete, how confident you are in your analysis, any potential issues with the submission, and feedback for the student on how to improve their submission.

Challenge Description: {{{challengeDescription}}}
Submission Text: {{{submissionText}}}
{{#if evidenceDataUri}}Evidence: {{media url=evidenceDataUri}}{{/if}}

Consider whether the submission fulfills the challenge description and provide specific feedback.
`,
});

const analyzeEvidenceFlow = ai.defineFlow(
  {
    name: 'analyzeEvidenceFlow',
    inputSchema: AnalyzeEvidenceInputSchema,
    outputSchema: AnalyzeEvidenceOutputSchema,
  },
  async input => {
    const {output} = await analyzeEvidencePrompt(input);
    return output!;
  }
);
