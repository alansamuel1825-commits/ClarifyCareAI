
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
    .describe('The combined text from the analysis to be translated. This may be a JSON string.'),
  targetLanguage: z.string().describe('The language to translate the text into (e.g., "Spanish").'),
});
export type MultilingualAnalysisInput = z.infer<typeof MultilingualAnalysisInputSchema>;

const MultilingualAnalysisOutputSchema = z.object({
  translatedText: z.string().describe('The translated text in the target language. If the input was JSON, this MUST be a valid JSON string with the same keys.'),
});
export type MultilingualAnalysisOutput = z.infer<typeof MultilingualAnalysisOutputSchema>;

const translateAnalysisPrompt = ai.definePrompt({
  name: 'translateAnalysisPrompt',
  input: {schema: MultilingualAnalysisInputSchema},
  output: {schema: MultilingualAnalysisOutputSchema},
  prompt: `You are an expert translator. Your goal is to translate the provided text or JSON object into {{targetLanguage}} while strictly preserving its structure and meaning.

If the input is a JSON string, ensure you ONLY translate the values (strings), never the keys. The output MUST be a valid JSON string that can be parsed by JSON.parse().

Text/JSON to translate:
{{{textToTranslate}}}

Output only the translated content.`,
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
