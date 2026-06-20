'use server';
/**
 * @fileOverview This file implements a Genkit flow for document analysis and simplification.
 * It takes a confusing document (text or data URI) and provides a plain language summary
 * and extracts key points.
 *
 * - documentAnalysisAndSimplification - The main function to call the Genkit flow.
 * - DocumentAnalysisInput - The input type for the function.
 * - DocumentAnalysisOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentAnalysisInputSchema = z.object({
  documentText: z.string().optional().describe('The document content as plain text.'),
  documentDataUri: z.string().optional().describe("The document content as a data URI (e.g., for PDF or image), including MIME type and Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
}).refine(data => data.documentText || data.documentDataUri, {
  message: 'Either documentText or documentDataUri must be provided.',
  path: ['documentText', 'documentDataUri'],
});

export type DocumentAnalysisInput = z.infer<typeof DocumentAnalysisInputSchema>;

const DocumentAnalysisOutputSchema = z.object({
  plainLanguageSummary: z.string().describe('A simple, easy-to-understand summary of the document, avoiding jargon.'),
  keyPoints: z.array(z.string()).describe('A list of the most important points extracted from the document.'),
});

export type DocumentAnalysisOutput = z.infer<typeof DocumentAnalysisOutputSchema>;

// Define the prompt for document analysis and simplification
const documentAnalysisPrompt = ai.definePrompt({
  name: 'documentAnalysisPrompt',
  input: {schema: DocumentAnalysisInputSchema},
  output: {schema: DocumentAnalysisOutputSchema},
  prompt: `You are an expert at simplifying complex documents and extracting essential information. Your goal is to help users quickly understand confusing notices, forms, letters, support documents, messages, and stressful situations.

Analyze the provided document content. Based on this analysis, generate a concise plain language summary and identify the most critical key points. Avoid technical jargon and use clear, accessible language.

Document Content:
{{#if documentText}}
Text provided:
{{{documentText}}}
{{/if}}
{{#if documentDataUri}}
Document image/PDF provided:
{{media url=documentDataUri}}
{{/if}}

If no document content is provided or if the content is empty, state clearly in the summary that you could not process the document due to lack of content.

Output should be a JSON object with two fields: "plainLanguageSummary" (string) and "keyPoints" (array of strings).
`,
});

// Define the Genkit flow
const documentAnalysisAndSimplificationFlow = ai.defineFlow(
  {
    name: 'documentAnalysisAndSimplificationFlow',
    inputSchema: DocumentAnalysisInputSchema,
    outputSchema: DocumentAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await documentAnalysisPrompt(input);
    if (!output) {
      throw new Error('Failed to generate document analysis output.');
    }
    return output;
  }
);

/**
 * Processes a document to provide a plain language summary and extract key points.
 * The document can be provided as plain text or a data URI (for images/PDFs).
 *
 * @param input - An object containing either `documentText` or `documentDataUri`.
 * @returns An object with a `plainLanguageSummary` and an array of `keyPoints`.
 */
export async function documentAnalysisAndSimplification(input: DocumentAnalysisInput): Promise<DocumentAnalysisOutput> {
  return documentAnalysisAndSimplificationFlow(input);
}
