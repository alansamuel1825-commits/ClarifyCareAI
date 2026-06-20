'use server';
/**
 * @fileOverview This file defines a Genkit flow for assessing the urgency of a document,
 * extracting deadlines, detailing consequences of inaction, and generating a step-by-step action plan.
 *
 * - actionPlanAndUrgencyAssessment - A function that orchestrates the assessment and plan generation.
 * - ActionPlanAndUrgencyAssessmentInput - The input type for the flow.
 * - ActionPlanAndUrgencyAssessmentOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ActionPlanAndUrgencyAssessmentInputSchema = z.object({
  documentText: z
    .string()
    .describe('The full text content of the document to be analyzed.'),
});
export type ActionPlanAndUrgencyAssessmentInput = z.infer<
  typeof ActionPlanAndUrgencyAssessmentInputSchema
>;

const ActionPlanAndUrgencyAssessmentOutputSchema = z.object({
  urgency: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The overall urgency level of the document.'),
  urgencyExplanation: z
    .string()
    .describe(
      'A brief explanation of why the document was assigned its specific urgency level.'
    ),
  deadlines: z
    .array(
      z.object({
        date: z
          .string()
          .describe('The specific date of the deadline in YYYY-MM-DD format.'),
        task: z
          .string()
          .describe('A brief description of the task associated with the deadline.'),
        importance: z
          .string()
          .describe('The importance of this specific deadline (e.g., "Critical", "Important", "Optional").'),
      })
    )
    .describe(
      'An array of detected deadlines, each with a date, associated task, and importance.'
    ),
  consequencesOfInaction: z
    .string()
    .describe(
      'A clear explanation of what may happen if the recommended actions are not taken or deadlines are missed.'
    ),
  actionPlan: z
    .array(z.string())
    .describe('A step-by-step checklist of actions the user should take.'),
});
export type ActionPlanAndUrgencyAssessmentOutput = z.infer<
  typeof ActionPlanAndUrgencyAssessmentOutputSchema
>;

export async function actionPlanAndUrgencyAssessment(
  input: ActionPlanAndUrgencyAssessmentInput
): Promise<ActionPlanAndUrgencyAssessmentOutput> {
  return actionPlanAndUrgencyAssessmentFlow(input);
}

const actionPlanAndUrgencyAssessmentPrompt = ai.definePrompt({
  name: 'actionPlanAndUrgencyAssessmentPrompt',
  input: {schema: ActionPlanAndUrgencyAssessmentInputSchema},
  output: {schema: ActionPlanAndUrgencyAssessmentOutputSchema},
  prompt: `You are an expert assistant designed to help users understand complex documents and respond effectively.
Your task is to analyze the provided document text, identify all crucial information related to timelines and actions, and present it in a clear, actionable format.

Perform the following steps:
1.  **Assess Urgency**: Determine the overall urgency of the situation presented in the document. Classify it as 'Low', 'Medium', or 'High'. Provide a concise explanation for your assessment.
2.  **Extract Deadlines**: Identify all explicit or implicit deadlines. For each deadline, specify the date (in YYYY-MM-DD format), the task associated with it, and its importance (e.g., "Critical", "Important", "Optional"). If no specific date is mentioned for an important task, use 'ASAP'.
3.  **Explain Consequences of Inaction**: Clearly state what negative outcomes or consequences might arise if the user fails to take the necessary actions or misses deadlines mentioned in the document.
4.  **Generate Action Plan**: Create a prioritized, step-by-step checklist of actions the user needs to take based on the document's content and deadlines.

Here is the document text for analysis:
"""{{{documentText}}}"""

Provide the output in a structured JSON format matching the output schema provided.`,
});

const actionPlanAndUrgencyAssessmentFlow = ai.defineFlow(
  {
    name: 'actionPlanAndUrgencyAssessmentFlow',
    inputSchema: ActionPlanAndUrgencyAssessmentInputSchema,
    outputSchema: ActionPlanAndUrgencyAssessmentOutputSchema,
  },
  async (input) => {
    const {output} = await actionPlanAndUrgencyAssessmentPrompt(input);
    return output!;
  }
);
