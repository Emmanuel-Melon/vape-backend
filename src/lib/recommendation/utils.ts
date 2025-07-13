import { Vaporizer, HeatingMethod, TempControl } from '@prisma/client';
import { UserPreferences } from './types';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Shared utility functions for the recommendation engine
 */

/**
 * Type for vaporizers with their relations
 */
export interface VaporizerWithRelations {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  currentPrice?: Decimal | number | null;
  msrp?: Decimal | number | null;
  heatupTime?: number | null;
  heatingMethod?: HeatingMethod | string | null;
  tempControl?: TempControl | string | null;
  batteryLife?: number | null;
  portabilityScore?: number | null;
  discreetnessScore?: number | null;
  expertScore?: number | null;
  userRating?: number | null;
  moods: { id: number; name: string }[];
  contexts: { id: number; name: string }[];
  scenarios: { id: number; name: string }[];
  bestFor: { id: number; name: string }[];
  deliveryMethods: { id: number; name: string }[];
};

/**
 * Type for match details
 */
export type MatchDetail = {
  category: string;
  score: number;
  maxScore: number;
  details?: string;
};

/**
 * Type for recommendation result
 */
export type RecommendationResult = {
  vaporizer: VaporizerWithRelations;
  score: number;
  matchPercentage: number;
  matchDetails: MatchDetail[];
};

/**
 * Score budget match between user preference and vaporizer price
 * 
 * Scoring rules:
 * - Perfect match (within budget range): 10 points
 * - Close match (within 20% of budget range): 5 points
 * - No match: 0 points
 */
export function scoreBudgetMatch(
  minBudget: number | undefined,
  maxBudget: number | undefined,
  vaporizerPrice: Decimal | number | null | undefined,
  maxPoints: number = 10
): number {
  if (minBudget === undefined || maxBudget === undefined || !vaporizerPrice) {
    return 0;
  }
  
  const price = Number(vaporizerPrice);
  
  // Perfect match: price is within budget range
  if (price >= minBudget && price <= maxBudget) {
    return maxPoints;
  }
  
  // Close match: price is within 20% of budget range
  const lowerBuffer = minBudget * 0.8;
  const upperBuffer = maxBudget * 1.2;
  
  if (price >= lowerBuffer && price <= upperBuffer) {
    return maxPoints / 2;
  }
  
  // No match
  return 0;
}

/**
 * Score categorical match between user preference and vaporizer attributes
 * 
 * Scoring rules:
 * - Direct match: +10 points per match
 * - Partial match: +5 points per related term
 * - No match: 0 points
 */
export function scoreCategoricalMatch(
  userPreferences: string[] | undefined,
  vaporizerItems: { id: number; name: string }[],
  weight: number = 10 // Default weight is 10 points per match
): number {
  if (!userPreferences || userPreferences.length === 0) {
    return 0;
  }
  
  let score = 0;
  const vaporizerTerms = vaporizerItems.map(item => item.name.toLowerCase());
  
  // Define related terms/synonyms for common moods and contexts
  const relatedTerms: Record<string, string[]> = {
    // Moods
    'relaxed': ['calm', 'peaceful', 'soothed', 'chill'],
    'energetic': ['uplifting', 'active', 'stimulating'],
    'creative': ['inspired', 'artistic', 'imaginative'],
    'focused': ['concentrated', 'attentive', 'alert'],
    'sleepy': ['sedated', 'drowsy', 'bedtime'],
    'euphoric': ['blissful', 'ecstatic', 'happy'],
    // Contexts
    'home': ['at_home', 'at_home_office', 'indoor', 'daily_use'],
    'medical_relief': ['therapeutic', 'medicinal', 'treatment'],
    'social_gathering': ['party', 'group_sessions', 'social']
  };
  
  // Count direct and related matches
  for (const pref of userPreferences) {
    const prefLower = pref.toLowerCase();
    
    // Check for direct match
    if (vaporizerTerms.includes(prefLower)) {
      score += weight; // Direct match
      continue;
    }
    
    // Check for related terms
    const relatedOptions = relatedTerms[prefLower] || [];
    for (const related of relatedOptions) {
      if (vaporizerTerms.includes(related.toLowerCase())) {
        score += weight / 2; // Partial match (half weight)
        break; // Only count one related match per preference
      }
    }
    
    // Check if this preference is a related term for any vaporizer attribute
    for (const term of vaporizerTerms) {
      const relatedToTerm = Object.entries(relatedTerms).find(([_, related]) => 
        related.includes(term) && related.includes(prefLower)
      );
      
      if (relatedToTerm) {
        score += weight / 2; // Partial match (half weight)
        break; // Only count one related match per preference
      }
    }
  }
  
  return score;
}

/**
 * Score numerical proximity between user preference and vaporizer attribute
 * 
 * Scoring rules:
 * - Perfect match: maxScore points
 * - Partial match: Proportional to proximity
 * - Inverse scoring: If true, a higher vaporizer value is better for a lower user preference
 */
export function scoreNumericalProximity(
  userPreference: number | undefined,
  vaporizerValue: number | null | undefined,
  maxScore: number = 10,
  inversed: boolean = false
): number {
  if (userPreference === undefined || vaporizerValue === undefined || vaporizerValue === null) {
    return 0;
  }
  
  // Calculate proximity (0 to 1, where 1 is perfect match)
  const diff = Math.abs(userPreference - vaporizerValue);
  const maxDiff = 10; // Assuming scale of 0-10
  let proximity = Math.max(0, 1 - (diff / maxDiff));
  
  // If inversed, flip the proximity (e.g., for discreteness where lower user preference means higher vaporizer score is better)
  if (inversed) {
    proximity = 1 - proximity;
  }
  
  // Convert proximity to score
  return proximity * maxScore;
}

/**
 * Score experience level match between user preference and vaporizer attribute
 * 
 * This function provides a more nuanced scoring for experience level matching:
 * - Beginners get higher scores for beginner-friendly vaporizers
 * - Intermediate users get moderate scores for both beginner and advanced vaporizers
 * - Advanced/expert users get higher scores for advanced vaporizers but can still use beginner ones
 * 
 * @param userExperienceLevel - User's experience level from quiz answers
 * @param vaporizerBestForTags - Array of vaporizer's bestFor tags
 * @param maxScore - Maximum score to award for a perfect match
 * @returns Score based on experience level compatibility
 */
export function scoreExperienceMatch(
  userExperienceLevel: string | undefined,
  vaporizerBestForTags: { id: number; name: string }[] | undefined,
  maxScore: number = 10
): number {
  if (!userExperienceLevel || !vaporizerBestForTags || vaporizerBestForTags.length === 0) {
    return 0;
  }
  
  // Map user experience levels to standardized values
  const userLevelMap: Record<string, string> = {
    'complete beginner': 'beginner',
    'some experience': 'intermediate',
    'experienced user': 'advanced',
    'expert/enthusiast': 'expert'
  };
  
  // Map vaporizer tags to experience levels
  const vaporizerTagToLevel: Record<string, string> = {
    'beginner_friendly': 'beginner',
    'heavy_user': 'advanced',
    'expert_friendly': 'expert',
    'tech_savvy_users': 'advanced'
  };
  
  // Get normalized user level
  const normalizedUserLevel = userLevelMap[userExperienceLevel.toLowerCase()] || 'intermediate';
  
  // Extract experience levels from vaporizer tags
  const vaporizerLevels: string[] = [];
  for (const tag of vaporizerBestForTags) {
    const level = vaporizerTagToLevel[tag.name];
    if (level) vaporizerLevels.push(level);
  }
  
  // If no experience-related tags found, assume it's intermediate level
  if (vaporizerLevels.length === 0) {
    vaporizerLevels.push('intermediate');
  }
  
  // Define compatibility matrix
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    'beginner': {
      'beginner': 1.0,    // Perfect match
      'intermediate': 0.5, // Somewhat compatible
      'advanced': 0.2,    // Not very compatible
      'expert': 0.0       // Not compatible
    },
    'intermediate': {
      'beginner': 0.7,    // Good match but not perfect
      'intermediate': 1.0, // Perfect match
      'advanced': 0.7,    // Good match but not perfect
      'expert': 0.4       // Challenging but usable
    },
    'advanced': {
      'beginner': 0.4,    // Can use but not optimal
      'intermediate': 0.8, // Good match
      'advanced': 1.0,    // Perfect match
      'expert': 0.8       // Good match
    },
    'expert': {
      'beginner': 0.2,    // Too basic
      'intermediate': 0.5, // Usable but not challenging enough
      'advanced': 0.9,    // Very good match
      'expert': 1.0       // Perfect match
    }
  };
  
  // Calculate best compatibility score across all vaporizer levels
  let bestCompatibilityScore = 0;
  for (const vaporizerLevel of vaporizerLevels) {
    const score = compatibilityMatrix[normalizedUserLevel]?.[vaporizerLevel] || 0;
    bestCompatibilityScore = Math.max(bestCompatibilityScore, score);
  }
  
  return bestCompatibilityScore * maxScore;
}

/**
 * Convert sample data to VaporizerWithRelations format
 */
export function convertSampleVaporizers(vaporizers: any[]): VaporizerWithRelations[] {
  return vaporizers.map(vaporizer => {
    // Generate a slug from the name if not provided
    const slug = vaporizer.slug || vaporizer.name.toLowerCase().replace(/\s+/g, '-');
    
    // Convert string arrays to object arrays with id and name if needed
    const convertToObjects = (arr: any[]): { id: number; name: string }[] => {
      if (arr.length === 0) return [];
      
      // If already in the right format, return as is
      if (typeof arr[0] === 'object' && 'id' in arr[0] && 'name' in arr[0]) {
        return arr;
      }
      
      // Convert strings to objects
      return arr.map((item, index) => ({
        id: index + 1,
        name: typeof item === 'string' ? item : String(item)
      }));
    };
    
    return {
      id: vaporizer.id || Math.floor(Math.random() * 1000),
      name: vaporizer.name,
      slug,
      description: vaporizer.description || '',
      currentPrice: vaporizer.currentPrice || null,
      msrp: vaporizer.msrp || null,
      heatupTime: vaporizer.heatupTime || null,
      heatingMethod: vaporizer.heatingMethod || null,
      tempControl: vaporizer.tempControl || null,
      batteryLife: vaporizer.batteryLife || null,
      portabilityScore: vaporizer.portabilityScore || null,
      discreetnessScore: vaporizer.discreetnessScore || null,
      expertScore: vaporizer.expertScore || null,
      userRating: vaporizer.userRating || null,
      moods: convertToObjects(vaporizer.moods || []),
      contexts: convertToObjects(vaporizer.contexts || []),
      scenarios: convertToObjects(vaporizer.scenarios || []),
      bestFor: convertToObjects(vaporizer.bestFor || []),
      deliveryMethods: convertToObjects(vaporizer.deliveryMethods || [])
    };
  });
}

/**
 * Score heating method match between user preference and vaporizer heating method
 * 
 * Scoring rules:
 * - Direct match: 10 points
 * - Hybrid match (when user prefers convection or conduction): 5 points
 * - No match: 0 points
 */
export function scoreHeatingMethodMatch(
  userPreference: string | undefined,
  vaporizerHeatingMethod: string | null | undefined
): number {
  if (!userPreference || !vaporizerHeatingMethod) {
    return 0;
  }
  
  // Normalize heating methods for comparison
  const userPref = userPreference.toUpperCase();
  const vaporizerMethod = vaporizerHeatingMethod.toUpperCase();
  
  // Direct match
  if (userPref === vaporizerMethod) {
    return 10;
  }
  
  // Hybrid is a partial match for either convection or conduction
  if (vaporizerMethod === 'HYBRID' && (userPref === 'CONVECTION' || userPref === 'CONDUCTION')) {
    return 5;
  }
  
  // No match
  return 0;
}

/**
 * Score temperature control match between user importance and vaporizer capability
 * 
 * Scoring rules:
 * - User values temp control highly + vaporizer has digital: 10 points
 * - User values temp control highly + vaporizer has analog: 5 points
 * - User values temp control somewhat + vaporizer has any control: 7 points
 * - User doesn't value temp control: 10 points (neutral)
 */
export function scoreTempControlMatch(
  userImportance: string | undefined,
  vaporizerTempControl: string | null | undefined
): number {
  if (!userImportance || !vaporizerTempControl) {
    return 0;
  }
  
  const tempControl = vaporizerTempControl.toUpperCase();
  
  // User considers temp control very important
  if (userImportance === 'VERY_IMPORTANT') {
    if (tempControl === 'DIGITAL') return 10;
    if (tempControl === 'ANALOG') return 5;
    return 0; // No temp control
  }
  
  // User considers temp control somewhat important
  if (userImportance === 'SOMEWHAT_IMPORTANT') {
    if (tempControl === 'DIGITAL' || tempControl === 'ANALOG') return 7;
    return 3; // No temp control
  }
  
  // User doesn't care about temp control
  return 10; // Neutral score
}

/**
 * Score portability and discreteness based on user importance
 * 
 * Scoring rules:
 * - Very important: Higher vaporizer scores get higher points
 * - Somewhat important: Moderate scoring curve
 * - Not important: Neutral scoring (full points)
 */
export function scoreImportanceBasedAttribute(
  userImportance: number | undefined,
  vaporizerScore: number | null | undefined,
  maxScore: number = 10
): number {
  if (userImportance === undefined || vaporizerScore === undefined || vaporizerScore === null) {
    return 0;
  }
  
  // Normalize user importance to 1-5 scale if it's not already
  const normalizedImportance = userImportance > 5 ? userImportance / 2 : userImportance;
  
  // If not important to user (importance <= 2), give full points
  if (normalizedImportance <= 2) {
    return maxScore;
  }
  
  // If very important (importance >= 4), score based on vaporizer's attribute
  if (normalizedImportance >= 4) {
    return (vaporizerScore / 10) * maxScore; // Assuming vaporizer score is on 0-10 scale
  }
  
  // Somewhat important (importance = 3), give partial credit
  return ((vaporizerScore / 10) * 0.7 + 0.3) * maxScore; // 70% based on score, 30% automatic
}
