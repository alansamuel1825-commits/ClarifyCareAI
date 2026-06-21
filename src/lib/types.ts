
import { DocumentAnalysisOutput } from '@/ai/flows/document-analysis-and-simplification';
import { ActionPlanAndUrgencyAssessmentOutput } from '@/ai/flows/action-plan-and-urgency-assessment';
import { ResourceRecommendationOutput } from '@/ai/flows/resource-recommendation-flow';

export type Language = 'English' | 'Tamil' | 'Hindi' | 'Spanish' | 'French';

export interface AgentInsight {
  agentName: string;
  insight: string;
  recommendations: string[];
}

export interface MoodEntry {
  timestamp: number;
  score: number; // 0-100
  label: string;
}

export interface AnalysisRecord {
  id: string;
  timestamp: number;
  originalText: string;
  language: Language;
  analysis: DocumentAnalysisOutput;
  actionPlan: ActionPlanAndUrgencyAssessmentOutput;
  resources: ResourceRecommendationOutput;
  completedSteps: string[];
  crisisDetected: boolean;
  crisisTypes: string[];
  confidenceScore: number;
  agentInsights: AgentInsight[];
  nextSteps?: string[];
  followUpCompleted?: boolean;
}

export type AccessibilitySettings = {
  highContrast: boolean;
  largeText: boolean;
  voiceSynthesis: boolean;
  darkMode: boolean;
  language: Language;
};

export interface UserProgress {
  streak: number;
  lastActive: number;
  badges: string[];
  moodScore: number;
  resilienceScore: number;
  onboardingComplete: boolean;
  moodHistory: MoodEntry[];
}
