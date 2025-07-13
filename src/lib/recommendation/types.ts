import { HeatingMethod, TempControl } from '@prisma/client';

/**
 * Interface representing user preferences extracted from quiz answers
 */
export interface UserPreferences {
  // Mood preferences
  moods: string[];
  
  // Context and scenario preferences
  contexts: string[];
  scenarios: string[];
  
  // User profile and usage patterns
  bestFor: string[];
  experienceLevel: ExperienceLevel;
  usageFrequency: UsageFrequency;
  
  // Technical preferences
  heatingMethodPreference: HeatingMethod | null;
  tempControlPreference: TempControl | null;
  
  // Importance scores (1-10)
  portabilityImportance: number;
  discreetnessImportance: number;
  
  // Delivery method preferences
  deliveryMethods: string[];
  
  // Budget constraints
  minBudget: number;
  maxBudget: number;
}

/**
 * Represents the user's experience level with vaporizers
 */
export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  EXPERIENCED = 'experienced',
  EXPERT = 'expert'
}

/**
 * Represents how frequently the user plans to use their vaporizer
 */
export enum UsageFrequency {
  RARELY = 'rarely',
  OCCASIONALLY = 'occasionally',
  REGULARLY = 'regularly',
  DAILY = 'daily',
  MULTIPLE_DAILY = 'multiple_daily'
}

/**
 * Interface for a vaporizer recommendation with score and explanation
 */
export interface VaporizerRecommendation {
  vaporizerId: number;
  matchScore: number;
  matchExplanation: string[];
}

/**
 * Interface for quiz answer mapping result
 */
export interface QuizAnswerMappingResult {
  success: boolean;
  preferences?: Partial<UserPreferences>;
  error?: string;
}
