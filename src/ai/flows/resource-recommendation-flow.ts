'use server';
/**
 * @fileOverview A Genkit flow for recommending tailored support resources based on document context.
 *
 * - recommendResources - A function that handles the resource recommendation process.
 * - ResourceRecommendationInput - The input type for the recommendResources function.
 * - ResourceRecommendationOutput - The return type for the recommendResources function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ResourceRecommendationInputSchema = z.object({
  documentClassification: z
    .string()
    .describe('The identified type of the document (e.g., school notice, housing assistance, medical instructions).'),
  keyPoints: z
    .string()
    .describe('Key information extracted from the document that indicates the user\'s needs.'),
  urgency: z.enum(['Low', 'Medium', 'High']).describe('The assessed urgency level of the situation.'),
  location: z
    .string()
    .optional()
    .describe('Optional: User\'s geographic location to find local resources (e.g., "San Francisco, CA").'),
});
export type ResourceRecommendationInput = z.infer<typeof ResourceRecommendationInputSchema>;

const ResourceSchema = z.object({
  name: z.string().describe('The name of the recommended resource.'),
  type: z.string().describe('The type of resource (e.g., "Non-profit organization", "Government agency", "Helpline", "School Contact").'),
  description: z.string().describe('A brief description of what the resource offers.'),
  contactInfo: z.string().describe('Contact information for the resource (e.g., phone number, website, address).'),
  relevanceExplanation: z.string().describe('A brief explanation of why this resource is relevant to the user\'s situation.'),
});

const ResourceRecommendationOutputSchema = z.object({
  resources: z.array(ResourceSchema).describe('A list of tailored support resources.'),
});
export type ResourceRecommendationOutput = z.infer<typeof ResourceRecommendationOutputSchema>;

export async function recommendResources(input: ResourceRecommendationInput): Promise<ResourceRecommendationOutput> {
  return resourceRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resourceRecommendationPrompt',
  input: { schema: ResourceRecommendationInputSchema },
  output: { schema: ResourceRecommendationOutputSchema },
  prompt: `You are an AI assistant specialized in recommending support resources. Based on the provided document classification, key points, urgency, and optional location, identify and recommend relevant support resources.

Focus on providing actionable resources such as organizations, services, counselors, helplines, or community programs. For each resource, include its name, type, a brief description, contact information (like phone, website, or address), and a concise explanation of its relevance.

If a location is provided, prioritize local resources. If no specific local resources can be found for a given location, provide general, widely available resources.

Document Classification: {{{documentClassification}}}
Key Points: {{{keyPoints}}}
Urgency: {{{urgency}}}
{{#if location}}Location: {{{location}}}{{/if}}

Provide at least 3-5 relevant resources.
`,
});

const resourceRecommendationFlow = ai.defineFlow(
  {
    name: 'resourceRecommendationFlow',
    inputSchema: ResourceRecommendationInputSchema,
    outputSchema: ResourceRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
