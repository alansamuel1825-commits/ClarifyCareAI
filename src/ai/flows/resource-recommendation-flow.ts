'use server';
/**
 * @fileOverview A Genkit flow for recommending the world's best support resources based on context.
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
  type: z.string().describe('The type of resource (e.g., "Non-profit organization", "Government agency", "Helpline").'),
  description: z.string().describe('A brief description of what the resource offers.'),
  contactInfo: z.string().describe('Detailed contact information (phone, website, or address).'),
  relevanceExplanation: z.string().describe('A deep explanation of why this specific resource is the best choice for this user.'),
});

const ResourceRecommendationOutputSchema = z.object({
  resources: z.array(ResourceSchema).describe('A list of tailored, best-in-class support resources.'),
});
export type ResourceRecommendationOutput = z.infer<typeof ResourceRecommendationOutputSchema>;

export async function recommendResources(input: ResourceRecommendationInput): Promise<ResourceRecommendationOutput> {
  return resourceRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resourceRecommendationPrompt',
  input: { schema: ResourceRecommendationInputSchema },
  output: { schema: ResourceRecommendationOutputSchema },
  prompt: `You are the ClarifyCare Resource Agent. Your goal is to identify the most effective, trusted, and "best-in-the-world" resources to help the user resolve their specific problem.

Organize your recommendations by relevance. Prioritize official government agencies, established non-profits, and verified helplines.

Include:
- Resource Name
- Type
- Description of services
- Detailed Contact Info
- Relevance Score: Explain exactly how this resource addresses the key points and urgency identified.

If a location is provided ({{{location}}}), use your knowledge of local services in that area. Otherwise, provide the best national or global resources.

Context:
Classification: {{{documentClassification}}}
Key Points: {{{keyPoints}}}
Urgency: {{{urgency}}}

Provide 3-5 high-quality resources.`,
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
