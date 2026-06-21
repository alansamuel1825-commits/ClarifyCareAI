
'use server';
/**
 * @fileOverview A Genkit flow for interactive support chat.
 * Allows users to ask questions about their document analysis results and broader journey history.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveChatInputSchema = z.object({
  analysisContext: z.string().describe('The stringified AnalysisRecord context for the current analysis.'),
  historyContext: z.string().optional().describe('Summarized context of previous analysis records and mood trends.'),
  userQuery: z.string().describe('The user\'s specific question or query.'),
  targetLanguage: z.string().describe('The language to respond in.'),
});
export type InteractiveChatInput = z.infer<typeof InteractiveChatInputSchema>;

const InteractiveChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user query, in the target language.'),
});
export type InteractiveChatOutput = z.infer<typeof InteractiveChatOutputSchema>;

const chatPrompt = ai.definePrompt({
  name: 'interactiveChatPrompt',
  input: {schema: InteractiveChatInputSchema},
  output: {schema: InteractiveChatOutputSchema},
  prompt: `You are the ClarifyCare AI Interactive Assistant. Your goal is to help the user understand their situation and action plan better, while remembering their broader journey.

CONTEXT:
Current Situation:
{{{analysisContext}}}

{{#if historyContext}}
User History (Past Problems & Trends):
{{{historyContext}}}
{{/if}}

User Question:
{{{userQuery}}}

Response Language: {{targetLanguage}}

INSTRUCTIONS:
- Answer accurately, empathetically, and clearly.
- If the user refers to past problems or "doubts regarding results", use the history context to provide a unified response.
- Prioritize actionable advice and emotional support.
- Provide the response directly in {{targetLanguage}}.`,
});

const interactiveChatFlow = ai.defineFlow(
  {
    name: 'interactiveChatFlow',
    inputSchema: InteractiveChatInputSchema,
    outputSchema: InteractiveChatOutputSchema,
  },
  async input => {
    const {output} = await chatPrompt(input);
    return output!;
  }
);

export async function askInteractiveAssistant(
  input: InteractiveChatInput
): Promise<InteractiveChatOutput> {
  return interactiveChatFlow(input);
}
