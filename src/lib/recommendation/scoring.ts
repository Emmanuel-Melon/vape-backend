import { UserPreferences, ExperienceLevel, UsageFrequency } from './types';
import { HeatingMethod, TempControl } from '@prisma/client';
import { 
  VaporizerWithRelations, 
  MatchDetail, 
  scoreBudgetMatch, 
  scoreCategoricalMatch, 
  scoreHeatingMethodMatch,
  scoreTempControlMatch,
  scoreImportanceBasedAttribute,
  scoreExperienceMatch,
  convertSampleVaporizers 
} from './utils';

/**
 * Step 2: Scoring Model
 * 
 * This module focuses solely on the scoring model that evaluates how well
 * each vaporizer matches user preferences.
 */

/**
 * Score vaporizers based on user preferences
 * 
 * @param preferences User preferences derived from quiz answers
 * @param vaporizers List of vaporizers to score
 * @returns Scored vaporizers with match details
 */
export function scoreVaporizers(
  preferences: UserPreferences, 
  vaporizers: VaporizerWithRelations[]
): Array<{
  vaporizer: VaporizerWithRelations;
  score: number;
  matchPercentage: number;
  matchDetails: MatchDetail[];
}> {
  return vaporizers.map(vaporizer => {
    const matchDetails: MatchDetail[] = [];
    
    // Budget scoring (25% weight)
    const budgetWeight = 25;
    let budgetScore = 0;
    
    if (preferences.minBudget !== undefined && preferences.maxBudget !== undefined) {
      budgetScore = scoreBudgetMatch(
        preferences.minBudget,
        preferences.maxBudget,
        vaporizer.currentPrice ? Number(vaporizer.currentPrice) : 0
      );
      
      matchDetails.push({
        category: 'Budget',
        score: budgetScore * budgetWeight / 10,
        maxScore: budgetWeight,
        details: `$${vaporizer.currentPrice} vs. $${preferences.minBudget}-$${preferences.maxBudget}`
      });
    }
    
    // Heating method scoring (15% weight)
    const heatingMethodWeight = 15;
    let heatingMethodScore = 0;
    
    if (preferences.heatingMethodPreference) {
      heatingMethodScore = scoreHeatingMethodMatch(
        preferences.heatingMethodPreference,
        vaporizer.heatingMethod
      );
      
      matchDetails.push({
        category: 'Heating Method',
        score: heatingMethodScore * heatingMethodWeight / 10,
        maxScore: heatingMethodWeight,
        details: `${vaporizer.heatingMethod} vs. ${preferences.heatingMethodPreference}`
      });
    }
    
    // Temperature control scoring (15% weight)
    const tempControlWeight = 15;
    let tempControlScore = 0;
    
    if (preferences.tempControlPreference) {
      tempControlScore = scoreTempControlMatch(
        preferences.tempControlPreference,
        vaporizer.tempControl
      );
      
      matchDetails.push({
        category: 'Temperature Control',
        score: tempControlScore * tempControlWeight / 10,
        maxScore: tempControlWeight,
        details: `${vaporizer.tempControl} vs. ${preferences.tempControlPreference}`
      });
    }
    
    // Delivery method scoring (15% weight)
    const deliveryMethodWeight = 15;
    let deliveryMethodScore = 0;
    
    if (preferences.deliveryMethods && preferences.deliveryMethods.length > 0) {
      deliveryMethodScore = scoreCategoricalMatch(
        preferences.deliveryMethods,
        vaporizer.deliveryMethods
      );
      
      matchDetails.push({
        category: 'Delivery Method',
        score: deliveryMethodScore * deliveryMethodWeight / 10,
        maxScore: deliveryMethodWeight,
        details: `${preferences.deliveryMethods.join(', ')} vs. ${vaporizer.deliveryMethods.map(d => d.name).join(', ')}`
      });
    }
    
    // Mood/context scoring (10% weight)
    const moodContextWeight = 10;
    let moodScore = 0;
    
    if (preferences.moods && preferences.moods.length > 0) {
      moodScore = scoreCategoricalMatch(
        preferences.moods,
        vaporizer.moods
      );
      
      matchDetails.push({
        category: 'Mood',
        score: moodScore * moodContextWeight / 10,
        maxScore: moodContextWeight,
        details: `${preferences.moods.join(', ')} vs. ${vaporizer.moods.map(m => m.name).join(', ')}`
      });
    }
    
    // Context scoring
    let contextScore = 0;
    
    if (preferences.contexts && preferences.contexts.length > 0) {
      contextScore = scoreCategoricalMatch(
        preferences.contexts,
        vaporizer.contexts
      );
      
      matchDetails.push({
        category: 'Context',
        score: contextScore * moodContextWeight / 10,
        maxScore: moodContextWeight,
        details: `${preferences.contexts.join(', ')} vs. ${vaporizer.contexts.map(c => c.name).join(', ')}`
      });
    }
    
    // Experience level scoring (10% weight) - using enhanced matching
    const experienceWeight = 10;
    let experienceScore = 0;
    
    if (preferences.experienceLevel) {
      // First approach: Use bestFor tags for categorical matching
      const experienceTags: { [key: string]: string[] } = {
        beginner: ['beginner_friendly', 'easy_to_use'],
        intermediate: ['versatile', 'balanced'],
        advanced: ['heavy_user', 'enthusiast', 'customizable']
      };
      
      const relevantTags = experienceTags[preferences.experienceLevel] || [];
      let tagBasedScore = 0;
      
      if (relevantTags.length > 0 && vaporizer.bestFor && vaporizer.bestFor.length > 0) {
        tagBasedScore = scoreCategoricalMatch(
          relevantTags,
          vaporizer.bestFor
        );
      }
      
      // Second approach: Use direct experience level matching with compatibility matrix
      // Pass the entire bestFor array to our enhanced experience matching function
      // which will handle the mapping between tags and experience levels internally
      const matrixBasedScore = scoreExperienceMatch(
        preferences.experienceLevel,
        vaporizer.bestFor
      );
      
      // Use the better of the two scores
      experienceScore = Math.max(tagBasedScore, matrixBasedScore);
      
      // Get a readable description of the vaporizer's experience level based on its tags
      let vaporizerExperienceDesc = 'intermediate';
      if (vaporizer.bestFor) {
        const bestForNames = vaporizer.bestFor.map(b => b.name);
        if (bestForNames.some(tag => tag === 'beginner_friendly')) {
          vaporizerExperienceDesc = 'beginner';
        } else if (bestForNames.some(tag => tag === 'heavy_user')) {
          vaporizerExperienceDesc = 'advanced';
        } else if (bestForNames.some(tag => tag === 'expert_friendly')) {
          vaporizerExperienceDesc = 'expert';
        }
      }
      
      matchDetails.push({
        category: 'Experience Level',
        score: experienceScore * experienceWeight / 10,
        maxScore: experienceWeight,
        details: `${preferences.experienceLevel} vs. ${vaporizerExperienceDesc} (compatibility: ${(experienceScore/10).toFixed(1)})`
      });
    }
    
    // Portability scoring (5% weight)
    const portabilityWeight = 5;
    let portabilityScore = 0;
    
    if (preferences.portabilityImportance !== undefined) {
      portabilityScore = scoreImportanceBasedAttribute(
        preferences.portabilityImportance,
        vaporizer.portabilityScore ? Number(vaporizer.portabilityScore) : 5
      );
      
      matchDetails.push({
        category: 'Portability',
        score: portabilityScore * portabilityWeight / 10,
        maxScore: portabilityWeight,
        details: `Importance: ${preferences.portabilityImportance}, Score: ${vaporizer.portabilityScore}`
      });
    }
    
    // Discreteness scoring (5% weight)
    const discreetnessWeight = 5;
    let discreetnessScore = 0;
    
    if (preferences.discreetnessImportance !== undefined) {
      discreetnessScore = scoreImportanceBasedAttribute(
        preferences.discreetnessImportance,
        vaporizer.discreetnessScore ? Number(vaporizer.discreetnessScore) : 5
      );
      
      matchDetails.push({
        category: 'Discreteness',
        score: discreetnessScore * discreetnessWeight / 10,
        maxScore: discreetnessWeight,
        details: `Importance: ${preferences.discreetnessImportance}, Score: ${vaporizer.discreetnessScore}`
      });
    }
    
    // Calculate total score and percentage
    const totalScore = Object.values(matchDetails).reduce((sum, detail) => sum + detail.score, 0);
    const totalMaxScore = Object.values(matchDetails).reduce((sum, detail) => sum + detail.maxScore, 0);
    const matchPercentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;
    
    return {
      vaporizer,
      score: totalScore,
      matchPercentage,
      matchDetails
    };
  });
}

/**
 * Test function to demonstrate the scoring model
 */
export function testScoringModel() {
  console.log('Testing Vaporizer Scoring Model (Step 2)...');
  
  // Sample user preferences
  const userPreferences: UserPreferences = {
    moods: ['relaxed'],
    contexts: ['home'],
    scenarios: [],
    bestFor: ['heavy_user'],
    experienceLevel: ExperienceLevel.INTERMEDIATE,
    usageFrequency: UsageFrequency.DAILY,
    minBudget: 300,
    maxBudget: 499.99,
    heatingMethodPreference: 'CONVECTION' as HeatingMethod,
    tempControlPreference: 'DIGITAL' as TempControl,
    portabilityImportance: 3,
    discreetnessImportance: 3,
    deliveryMethods: ['direct_draw']
  };
  
  console.log('\nUser Preferences:');
  console.log(JSON.stringify(userPreferences, null, 2));
  
  // Sample vaporizers
  const sampleVaporizers = [
    {
      id: 1,
      name: 'Mighty+',
      slug: 'mighty-plus',
      description: 'Premium portable vaporizer',
      currentPrice: 399,
      heatingMethod: 'HYBRID',
      tempControl: 'DIGITAL',
      portabilityScore: 7,
      discreetnessScore: 6,
      moods: ['relaxed', 'focused'],
      contexts: ['home', 'outdoor'],
      scenarios: [],
      bestFor: ['heavy_user', 'medical'],
      deliveryMethods: ['direct_draw']
    },
    {
      id: 2,
      name: 'Volcano Hybrid',
      slug: 'volcano-hybrid',
      description: 'Premium desktop vaporizer',
      currentPrice: 699,
      heatingMethod: 'CONVECTION',
      tempControl: 'DIGITAL',
      portabilityScore: 2,
      discreetnessScore: 3,
      moods: ['relaxed', 'social'],
      contexts: ['home'],
      scenarios: [],
      bestFor: ['heavy_user', 'medical', 'groups'],
      deliveryMethods: ['balloon', 'whip']
    }
  ];
  
  // Convert to proper format
  const vaporizers = convertSampleVaporizers(sampleVaporizers);
  
  // Score vaporizers
  const scoredVaporizers = scoreVaporizers(userPreferences, vaporizers);
  
  // Display results
  console.log('\nScoring Results:');
  scoredVaporizers.forEach((result, index) => {
    console.log(`\n#${index + 1}: ${result.vaporizer.name} (${result.matchPercentage}% match)`);
    console.log(`Price: $${result.vaporizer.currentPrice}`);
    console.log(`Heating Method: ${result.vaporizer.heatingMethod}, Temp Control: ${result.vaporizer.tempControl}`);
    console.log('Match details:');
    
    result.matchDetails.forEach(detail => {
      console.log(`- ${detail.category}: ${detail.score}/${detail.maxScore} points`);
    });
  });
  
  console.log('\nScoring model test completed.');
}

// Run test if this file is executed directly
if (require.main === module) {
  testScoringModel();
}
