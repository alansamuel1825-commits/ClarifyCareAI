'use server';
/**
 * @fileOverview This file defines a Genkit flow for assessing the urgency of a document,
 * extracting deadlines, detailing consequences of inaction, and generating a detailed pedagogical action plan.
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
    .describe('A high-detail, step-by-step pedagogical checklist of actions the user should take. Each step must be actionable and clear.'),
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
  prompt: `You are the ClarifyCare Planning Agent. Your mission is to convert complex stressful situations into a clear, manageable path forward.

Analyze the document text and perform the following:

1. **Assess Urgency**: Determine if this situation is 'Low', 'Medium', or 'High' urgency. Explain why based on the text.
2. **Extract Deadlines**: Find every date mentioned. If no date is found but urgency is high, suggest 'Immediate Action Required'. For each, provide the Date (YYYY-MM-DD), Task, and Importance.
3. **Detail Consequences**: Explain precisely what the risks are if no action is taken (e.g., loss of benefits, legal fees, health risks).
4. **Resolution Protocol**: Create an exhaustive, step-by-step checklist. Start from the very first thing they need to do (e.g., "Gather these 3 documents") to the final resolution. Use clear, simple, and pedagogical language.

Document Content:
"""{{{documentText}}}"""

Provide output in structured JSON.`,
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
