/**
 * Test script for the vaporizer recommendation system
 * 
 * This script tests the recommendation system with different user profiles
 * to validate the enhanced experience level matching and overall workflow.
 */

import { getVaporizerRecommendations } from './index';
import { VaporizerWithRelations } from './utils';

// Test different user profiles
async function testRecommendationSystem() {
  console.log('=== TESTING VAPORIZER RECOMMENDATION SYSTEM ===\n');
  
  // Test Case 1: Beginner user
  console.log('TEST CASE 1: BEGINNER USER');
  const beginnerAnswers = {
    mood: 'relaxed',
    context: 'at home',
    experience: 'complete beginner',
    frequency: 'occasionally (few times a month)',
    budget: '$100-$200',
    heatingMethod: 'convection',
    tempControl: 'very important',
    portability: 'somewhat important',
    discreetness: 'not important',
    deliveryMethod: 'direct draw'
  };
  
  try {
    const beginnerResults = await getVaporizerRecommendations(beginnerAnswers);
    console.log(`Top 3 recommendations for beginner user:`);
    beginnerResults.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`\n#${i + 1}: ${rec.vaporizer.name} (${rec.matchPercentage}% match)`);
      console.log(`Price: $${rec.vaporizer.currentPrice}`);
      // Check for experience-related tags in the bestFor array
      const hasBeginner = rec.vaporizer.bestFor?.some(tag => tag.name === 'beginner_friendly') || false;
      const hasHeavyUser = rec.vaporizer.bestFor?.some(tag => tag.name === 'heavy_user') || false;
      const hasExpert = rec.vaporizer.bestFor?.some(tag => tag.name === 'expert_friendly') || false;
      
      // Display experience level information
      console.log('Experience tags: ' + 
        (hasBeginner ? 'beginner_friendly ' : '') + 
        (hasHeavyUser ? 'heavy_user ' : '') + 
        (hasExpert ? 'expert_friendly' : '') || 'none');
      
      // Display all bestFor tags
      const bestForTags = rec.vaporizer.bestFor?.map(tag => tag.name).join(', ') || 'not specified';
      console.log(`Best for: ${bestForTags}`);
      
      // Show detailed scoring breakdown
      console.log('\nScoring breakdown:');
      rec.matchDetails.forEach(detail => {
        console.log(`- ${detail.category}: ${detail.score.toFixed(1)} points`);
      });
    });
  } catch (error) {
    console.error('Error in beginner test case:', error);
  }
  
  console.log('\n' + '-'.repeat(50) + '\n');
  
  // Test Case 2: Advanced user
  console.log('TEST CASE 2: ADVANCED USER');
  const advancedAnswers = {
    mood: 'creative',
    context: 'social gatherings',
    experience: 'expert/enthusiast',
    frequency: 'daily',
    budget: '$300-$500',
    heatingMethod: 'hybrid',
    tempControl: 'very important',
    portability: 'not important',
    discreetness: 'not important',
    deliveryMethod: 'whip/tube'
  };
  
  try {
    const advancedResults = await getVaporizerRecommendations(advancedAnswers);
    console.log(`Top 3 recommendations for advanced user:`);
    advancedResults.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`\n#${i + 1}: ${rec.vaporizer.name} (${rec.matchPercentage}% match)`);
      console.log(`Price: $${rec.vaporizer.currentPrice}`);
      // Check for experience-related tags in the bestFor array
      const hasBeginner = rec.vaporizer.bestFor?.some(tag => tag.name === 'beginner_friendly') || false;
      const hasHeavyUser = rec.vaporizer.bestFor?.some(tag => tag.name === 'heavy_user') || false;
      const hasExpert = rec.vaporizer.bestFor?.some(tag => tag.name === 'expert_friendly') || false;
      
      // Display experience level information
      console.log('Experience tags: ' + 
        (hasBeginner ? 'beginner_friendly ' : '') + 
        (hasHeavyUser ? 'heavy_user ' : '') + 
        (hasExpert ? 'expert_friendly' : '') || 'none');
      
      // Display all bestFor tags
      const bestForTags = rec.vaporizer.bestFor?.map(tag => tag.name).join(', ') || 'not specified';
      console.log(`Best for: ${bestForTags}`);
      
      // Show detailed scoring breakdown
      console.log('\nScoring breakdown:');
      rec.matchDetails.forEach(detail => {
        console.log(`- ${detail.category}: ${detail.score.toFixed(1)} points`);
      });
    });
  } catch (error) {
    console.error('Error in advanced test case:', error);
  }
  
  console.log('\n=== RECOMMENDATION SYSTEM TEST COMPLETED ===');
}

// Run the test
testRecommendationSystem().catch(console.error);
