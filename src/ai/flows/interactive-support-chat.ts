
'use server';
/**
 * @fileOverview A Genkit flow for interactive support chat.
 * Allows users to ask questions about their document analysis results.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveChatInputSchema = z.object({
  analysisContext: z.string().describe('The stringified AnalysisRecord context for the chat.'),
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
  prompt: `You are the ClarifyCare AI Interactive Assistant. Your goal is to help the user understand their situation and action plan better.

Use the provided context to answer their question accurately, empathetically, and clearly. If the question is about a specific deadline or step in the action plan, prioritize that information.

Analysis Context:
{{{analysisContext}}}

User Question:
{{{userQuery}}}

Response Language: {{targetLanguage}}

Provide a direct, helpful, and concise response in {{targetLanguage}}.`,
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
