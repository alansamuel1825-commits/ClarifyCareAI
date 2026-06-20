'use server';
/**
 * @fileOverview A Genkit flow for translating analysis output into a specified language.
 *
 * - multilingualAnalysisOutput - A function that translates the provided text.
 * - MultilingualAnalysisInput - The input type for the multilingualAnalysisOutput function.
 * - MultilingualAnalysisOutput - The return type for the multilingualAnalysisOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultilingualAnalysisInputSchema = z.object({
  textToTranslate: z
    .string()
    .describe('The combined text from the analysis to be translated.'),
  targetLanguage: z.string().describe('The language to translate the text into (e.g., "Spanish").'),
});
export type MultilingualAnalysisInput = z.infer<typeof MultilingualAnalysisInputSchema>;

const MultilingualAnalysisOutputSchema = z.object({
  translatedText: z.string().describe('The translated text in the target language.'),
});
export type MultilingualAnalysisOutput = z.infer<typeof MultilingualAnalysisOutputSchema>;

const translateAnalysisPrompt = ai.definePrompt({
  name: 'translateAnalysisPrompt',
  input: {schema: MultilingualAnalysisInputSchema},
  output: {schema: MultilingualAnalysisOutputSchema},
  prompt: `Translate the following text into {{targetLanguage}} while preserving its structure and meaning. Ensure that all key information, explanations, action plans, and resource recommendations are accurately conveyed in the target language.

Text to translate:

{{textToTranslate}}`,
});

const multilingualAnalysisOutputFlow = ai.defineFlow(
  {
    name: 'multilingualAnalysisOutputFlow',
    inputSchema: MultilingualAnalysisInputSchema,
    outputSchema: MultilingualAnalysisOutputSchema,
  },
  async input => {
    const {output} = await translateAnalysisPrompt(input);
    return output!;
  }
);

export async function multilingualAnalysisOutput(
  input: MultilingualAnalysisInput
): Promise<MultilingualAnalysisOutput> {
  return multilingualAnalysisOutputFlow(input);
}
