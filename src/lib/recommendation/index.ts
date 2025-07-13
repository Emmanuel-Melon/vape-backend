/**
 * Vaporizer Recommendation Algorithm
 * 
 * This is the main entry point for the vaporizer recommendation system.
 * It coordinates the different steps of the recommendation process:
 * 
 * Step 1: Quiz Answer Mapping - Convert user quiz answers to structured preferences
 * Step 2: Scoring Model - Score vaporizers based on user preferences
 */

import { UserPreferences } from './types';
import { QuizMapper } from './quiz-mapper';
import { scoreVaporizers } from './scoring';
import { VaporizerWithRelations, convertSampleVaporizers, RecommendationResult } from './utils';
import { vaporizerData } from '../../../prisma/data';

/**
 * Get vaporizer recommendations based on quiz answers
 * 
 * This is the main recommendation workflow function that coordinates the multi-step process:
 * 1. Maps raw quiz answers to structured user preferences using QuizMapper
 * 2. Scores vaporizers against user preferences using the scoring model
 * 
 * The function returns both the structured user preferences and the ranked recommendations
 * with detailed match breakdowns.
 * 
 * @param quizAnswers - Raw quiz answers from the user interface
 * @param vaporizers - Array of vaporizers to score and rank
 * @returns Object containing user preferences and scored recommendations
 */
export async function getVaporizerRecommendations(
  quizAnswers: Record<string, string>,
  vaporizers: VaporizerWithRelations[] = []
): Promise<{
  userPreferences: UserPreferences;
  recommendations: RecommendationResult[];
}> {
  console.log('Starting vaporizer recommendation process...');
  
  try {
    // If no vaporizers provided, use data from Prisma
    if (vaporizers.length === 0) {
      console.log('No vaporizers provided, using data from Prisma...');
      vaporizers = convertSampleVaporizers(vaporizerData);
    }
    
    // Step 1: Map quiz answers to user preferences
    // This transforms raw quiz answers into a structured UserPreferences object
    // that can be used for scoring and matching
    console.log('Step 1: Mapping quiz answers to user preferences...');
    const userPreferences = await mapQuizAnswersToPreferences(quizAnswers);
    
    console.log('User preferences successfully mapped');
    
    // Step 2: Score vaporizers based on user preferences
    // This evaluates each vaporizer against the user preferences using
    // weighted scoring across multiple categories
    console.log('Step 2: Scoring vaporizers based on user preferences...');
    const scoredVaporizers = scoreVaporizers(userPreferences, vaporizers);
    console.log(`Scored ${scoredVaporizers.length} vaporizers`);
    
    // Return both the user preferences and the scored recommendations
    // This allows the calling code to access both the input and output of the process
    return {
      userPreferences,
      recommendations: scoredVaporizers.sort((a, b) => b.score - a.score)
    };
  } catch (error) {
    console.error('Error in vaporizer recommendation process:', error);
    throw new Error(`Recommendation process failed: ${error.message}`);
  }
}

/**
 * Map quiz answers to user preferences
 * 
 * This function takes raw quiz answers from the user interface and maps them
 * to structured user preferences using the QuizMapper class. It handles all
 * the necessary transformations and validations.
 * 
 * @param quizAnswers - Raw quiz answers from the user interface
 * @returns Promise resolving to structured UserPreferences object
 */
async function mapQuizAnswersToPreferences(quizAnswers: Record<string, string>): Promise<UserPreferences> {
  const quizMapper = new QuizMapper();
  
  try {
    // Extract each preference from the quiz answers
    const moodResult = quizMapper.mapMoodPreference(quizAnswers.mood || '');
    const contextResult = quizMapper.mapUsageContext(quizAnswers.context || '');
    const experienceResult = quizMapper.mapExperienceLevel(quizAnswers.experience || '');
    const frequencyResult = quizMapper.mapUsageFrequency(quizAnswers.frequency || '');
    const budgetResult = quizMapper.mapBudgetRange(quizAnswers.budget || '');
    const heatingMethodResult = quizMapper.mapHeatingMethodPreference(quizAnswers.heatingMethod || '');
    const tempControlResult = quizMapper.mapTemperatureControlImportance(quizAnswers.tempControl || '');
    const portabilityResult = quizMapper.mapPortabilityImportance(quizAnswers.portability || '');
    const discreetnessResult = quizMapper.mapDiscreetnessImportance(quizAnswers.discreetness || '');
    const deliveryMethodResult = quizMapper.mapDeliveryMethodPreference(quizAnswers.deliveryMethod || '');
    
    // Check if all mappings were successful
    const allResults = [
      moodResult, contextResult, experienceResult, frequencyResult,
      budgetResult, heatingMethodResult, tempControlResult,
      portabilityResult, discreetnessResult, deliveryMethodResult
    ];
    
    const failedMappings = allResults.filter(result => !result.success);
    
    if (failedMappings.length > 0) {
      const errorMessages = failedMappings.map(result => result.error).join('\n');
      throw new Error(`Failed to map some quiz answers: ${errorMessages}`);
    }
    
    // Combine all preferences into a single object
    const userPreferences: UserPreferences = {
      moods: moodResult.preferences?.moods || [],
      contexts: contextResult.preferences?.contexts || [],
      scenarios: contextResult.preferences?.scenarios || [],
      bestFor: [],
      experienceLevel: experienceResult.preferences?.experienceLevel!,
      usageFrequency: frequencyResult.preferences?.usageFrequency!,
      minBudget: budgetResult.preferences?.minBudget || 0,
      maxBudget: budgetResult.preferences?.maxBudget || 1000,
      heatingMethodPreference: heatingMethodResult.preferences?.heatingMethodPreference || null,
      tempControlPreference: tempControlResult.preferences?.tempControlPreference || null,
      portabilityImportance: portabilityResult.preferences?.portabilityImportance || 5,
      discreetnessImportance: discreetnessResult.preferences?.discreetnessImportance || 5,
      deliveryMethods: deliveryMethodResult.preferences?.deliveryMethods || []
    };
    
    return userPreferences;
  } catch (error) {
    console.error('Error mapping quiz answers to preferences:', error);
    throw new Error(`Failed to map quiz answers to preferences: ${error.message}`);
  }
}

/**
 * Test function to demonstrate the full recommendation workflow
 */
export function testRecommendationWorkflow() {
  console.log('Testing Vaporizer Recommendation Workflow...');
  
  // Sample quiz answers
  const quizAnswers = {
    mood: 'relaxed',
    context: 'at home',
    experience: 'some experience',
    frequency: 'daily',
    budget: '$300-$500',
    heatingMethod: 'convection',
    tempControl: 'somewhat important',
    portability: 'somewhat important',
    discreetness: 'somewhat important',
    deliveryMethod: 'direct draw'
  };
  
  console.log('\nSample Quiz Answers:');
  console.log(JSON.stringify(quizAnswers, null, 2));
  
  // Use vaporizer data from Prisma data file
  // Transform the data to match the expected format for scoring
  try {
    // Convert vaporizer data from Prisma format to the format expected by the scoring functions
    const vaporizers = convertSampleVaporizers(vaporizerData.map((vaporizer, index) => {
      return {
        id: index + 1,
        name: vaporizer.name,
        slug: vaporizer.name.toLowerCase().replace(/\s+/g, '-'),
        description: `${vaporizer.category} vaporizer by ${vaporizer.manufacturer}`,
        currentPrice: vaporizer.currentPrice,
        heatingMethod: vaporizer.heatingMethod,
        tempControl: vaporizer.tempControl,
        portabilityScore: vaporizer.portabilityScore,
        discreetnessScore: vaporizer.discreetnessScore,
        // The convertSampleVaporizers function will handle the conversion of arrays to objects
        moods: vaporizer.moods || [],
        contexts: vaporizer.contexts || [],
        scenarios: vaporizer.scenarios || [],
        bestFor: vaporizer.bestFor || [],
        deliveryMethods: vaporizer.deliveryMethods || []
      };
    }));
  
  // Run the recommendation workflow
    getVaporizerRecommendations(quizAnswers, vaporizers)
      .then(result => {
        console.log('\nRecommendation Results:');
        result.recommendations.forEach((rec, index) => {
          console.log(`\n#${index + 1}: ${rec.vaporizer.name} (${rec.matchPercentage}% match)`);
          console.log(`Price: $${rec.vaporizer.currentPrice}`);
          console.log(`Heating Method: ${rec.vaporizer.heatingMethod}, Temp Control: ${rec.vaporizer.tempControl}`);
          console.log('Match details:');
          
          rec.matchDetails.forEach(detail => {
            console.log(`- ${detail.category}: ${detail.score}/${detail.maxScore} points`);
          });
        });
        
        console.log('\nRecommendation workflow test completed.');
      })
      .catch(error => {
        console.error('Error in recommendation workflow:', error);
      });
  } catch (error) {
    console.error('Error preparing vaporizer data:', error);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testRecommendationWorkflow();
}
