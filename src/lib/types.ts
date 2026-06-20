
import { DocumentAnalysisOutput } from '@/ai/flows/document-analysis-and-simplification';
import { ActionPlanAndUrgencyAssessmentOutput } from '@/ai/flows/action-plan-and-urgency-assessment';
import { ResourceRecommendationOutput } from '@/ai/flows/resource-recommendation-flow';

export interface AnalysisRecord {
  id: string;
  timestamp: number;
  originalText: string;
  analysis: DocumentAnalysisOutput;
  actionPlan: ActionPlanAndUrgencyAssessmentOutput;
  resources: ResourceRecommendationOutput;
  completedSteps: string[];
}

export type AccessibilitySettings = {
  highContrast: boolean;
  largeText: boolean;
  voiceSynthesis: boolean;
};
