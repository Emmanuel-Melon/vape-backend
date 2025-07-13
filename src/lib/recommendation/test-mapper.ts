import { QuizMapper } from './quiz-mapper';
import { QuestionType } from '@prisma/client';
import { QuizAnswerMappingResult } from './types';

/**
 * This script tests the quiz mapper with a predefined set of questions and answers
 * to verify that the mappings are deterministic.
 */

// Create a sample quiz with questions based on our mapping
export const sampleQuiz = {
  id: 1,
  title: "Vaporizer Recommendation Quiz",
  description: "Find your perfect vaporizer match",
  questions: [
    {
      id: 1,
      text: "What's your preferred mood?",
      type: QuestionType.SINGLE_SELECT,
      options: [
        { id: 1, value: "relaxed", label: "Relaxed" },
        { id: 2, value: "energetic", label: "Energetic" },
        { id: 3, value: "creative", label: "Creative" },
        { id: 4, value: "focused", label: "Focused" },
        { id: 5, value: "sleepy", label: "Sleepy" },
        { id: 6, value: "euphoric", label: "Euphoric" },
        { id: 7, value: "happy", label: "Happy" }
      ]
    },
    {
      id: 2,
      text: "Where do you usually vape?",
      type: QuestionType.SINGLE_SELECT,
      options: [
        { id: 8, value: "at_home", label: "At home" },
        { id: 9, value: "on_the_go", label: "On the go" },
        { id: 10, value: "social_gatherings", label: "Social gatherings" },
        { id: 11, value: "medical_relief", label: "Medical relief" },
        { id: 12, value: "outdoor_activities", label: "Outdoor activities" },
        { id: 13, value: "in_a_vehicle", label: "In a vehicle" }
      ]
    },
    {
      id: 3,
      text: "How experienced are you with vaporizers?",
      type: QuestionType.SINGLE_SELECT,
      options: [
        { id: 14, value: "complete_beginner", label: "Complete beginner" },
        { id: 15, value: "some_experience", label: "Some experience" },
        { id: 16, value: "experienced_user", label: "Experienced user" },
        { id: 17, value: "expert", label: "Expert/Enthusiast" }
      ]
    },
    {
      id: 4,
      text: "How often do you plan to use your vaporizer?",
      type: QuestionType.SINGLE_SELECT,
      options: [
        { id: 18, value: "rarely", label: "Rarely (special occasions)" },
        { id: 19, value: "occasionally", label: "Occasionally (few times a month)" },
        { id: 20, value: "regularly", label: "Regularly (few times a week)" },
        { id: 21, value: "daily", label: "Daily" },
        { id: 22, value: "multiple_daily", label: "Multiple times daily" }
      ]
    },
    {
      id: 5,
      text: "What's your budget range?",
      type: QuestionType.SINGLE_SELECT,
      options: [
        { id: 23, value: "under_100", label: "Under $100" },
        { id: 24, value: "100_200", label: "$100-$200" },
        { id: 25, value: "200_300", label: "$200-$300" },
        { id: 26, value: "300_500", label: "$300-$500" },
        { id: 27, value: "500_plus", label: "$500+" }
      ]
    },
    {
      id: 6,
      text: "Do you have a preference for heating method?",
      type: QuestionType.SINGLE_SELECT,
      options: [
        { id: 28, value: "conduction", label: "Conduction" },
        { id: 29, value: "convection", label: "Convection" },
        { id: 30, value: "hybrid", label: "Hybrid" },
        { id: 31, value: "no_preference", label: "No preference/I don't know" }
      ]
    },
    {
      id: 7,
      text: "How important is precise temperature control to you?",
      type: QuestionType.SINGLE_SELECT,
      options: [
        { id: 32, value: "very_important", label: "Very important" },
        { id: 33, value: "somewhat_important", label: "Somewhat important" },
        { id: 34, value: "not_important", label: "Not important" }
      ]
    },
    {
      id: 8,
      text: "How important is portability to you?",
      type: QuestionType.SINGLE_SELECT,
      options: [
        { id: 35, value: "very_important", label: "Very important" },
        { id: 36, value: "somewhat_important", label: "Somewhat important" },
        { id: 37, value: "not_important", label: "Not important" }
      ]
    },
    {
      id: 9,
      text: "How important is discreteness to you?",
      type: QuestionType.SINGLE_SELECT,
      options: [
        { id: 38, value: "very_important", label: "Very important" },
        { id: 39, value: "somewhat_important", label: "Somewhat important" },
        { id: 40, value: "not_important", label: "Not important" }
      ]
    },
    {
      id: 10,
      text: "Do you have a preference for how you inhale?",
      type: QuestionType.SINGLE_SELECT,
      options: [
        { id: 41, value: "direct_draw", label: "Direct draw" },
        { id: 42, value: "through_water", label: "Through water" },
        { id: 43, value: "balloon", label: "Balloon/bag" },
        { id: 44, value: "whip", label: "Whip/tube" }
      ]
    }
  ]
};

// Sample answers to the quiz
export const sampleAnswers = [
  { questionId: 1, answer: "Relaxed" },
  { questionId: 2, answer: "At home" },
  { questionId: 3, answer: "Some experience" },
  { questionId: 4, answer: "Daily" },
  { questionId: 5, answer: "$300-$500" },
  { questionId: 6, answer: "Convection" },
  { questionId: 7, answer: "Very important" },
  { questionId: 8, answer: "Not important" },
  { questionId: 9, answer: "Not important" },
  { questionId: 10, answer: "Direct draw" }
];

// Create an instance of the quiz mapper
const quizMapper = new QuizMapper();

// Process each answer and collect the results
console.log("Testing Quiz Mapper with sample answers...\n");
console.log("Sample Quiz:", JSON.stringify(sampleQuiz, null, 2));
console.log("\nSample Answers:", JSON.stringify(sampleAnswers, null, 2));

// Process each answer and collect the results
console.log("\nMapping Results:");
const mappingResults: QuizAnswerMappingResult[] = [];

// Process mood preference (Question 1)
const moodResult = quizMapper.mapMoodPreference(sampleAnswers[0].answer);
console.log("\n1. Mood Preference Mapping:");
console.log(JSON.stringify(moodResult, null, 2));
mappingResults.push(moodResult);

// Process usage context (Question 2)
const contextResult = quizMapper.mapUsageContext(sampleAnswers[1].answer);
console.log("\n2. Usage Context Mapping:");
console.log(JSON.stringify(contextResult, null, 2));
mappingResults.push(contextResult);

// Process experience level (Question 3)
const experienceResult = quizMapper.mapExperienceLevel(sampleAnswers[2].answer);
console.log("\n3. Experience Level Mapping:");
console.log(JSON.stringify(experienceResult, null, 2));
mappingResults.push(experienceResult);

// Process usage frequency (Question 4)
const frequencyResult = quizMapper.mapUsageFrequency(sampleAnswers[3].answer);
console.log("\n4. Usage Frequency Mapping:");
console.log(JSON.stringify(frequencyResult, null, 2));
mappingResults.push(frequencyResult);

// Process budget range (Question 5)
const budgetResult = quizMapper.mapBudgetRange(sampleAnswers[4].answer);
console.log("\n5. Budget Range Mapping:");
console.log(JSON.stringify(budgetResult, null, 2));
mappingResults.push(budgetResult);

// Process heating method preference (Question 6)
const heatingResult = quizMapper.mapHeatingMethodPreference(sampleAnswers[5].answer);
console.log("\n6. Heating Method Preference Mapping:");
console.log(JSON.stringify(heatingResult, null, 2));
mappingResults.push(heatingResult);

// Process temperature control importance (Question 7)
const tempControlResult = quizMapper.mapTemperatureControlImportance(sampleAnswers[6].answer);
console.log("\n7. Temperature Control Importance Mapping:");
console.log(JSON.stringify(tempControlResult, null, 2));
mappingResults.push(tempControlResult);

// Process portability importance (Question 8)
const portabilityResult = quizMapper.mapPortabilityImportance(sampleAnswers[7].answer);
console.log("\n8. Portability Importance Mapping:");
console.log(JSON.stringify(portabilityResult, null, 2));
mappingResults.push(portabilityResult);

// Process discreteness importance (Question 9)
const discretenessResult = quizMapper.mapDiscreetnessImportance(sampleAnswers[8].answer);
console.log("\n9. Discreteness Importance Mapping:");
console.log(JSON.stringify(discretenessResult, null, 2));
mappingResults.push(discretenessResult);

// Process delivery method preference (Question 10)
const deliveryResult = quizMapper.mapDeliveryMethodPreference(sampleAnswers[9].answer);
console.log("\n10. Delivery Method Preference Mapping:");
console.log(JSON.stringify(deliveryResult, null, 2));
mappingResults.push(deliveryResult);

// Combine all preferences into a single object
const combinedPreferences = mappingResults.reduce((combined, result) => {
  if (result.success && result.preferences) {
    return { ...combined, ...result.preferences };
  }
  return combined;
}, {});

console.log("\nCombined User Preferences:");
console.log(JSON.stringify(combinedPreferences, null, 2));

// Check if there were any mapping errors
const errors = mappingResults.filter(result => !result.success);
if (errors.length > 0) {
  console.log("\nMapping Errors:");
  errors.forEach((error, index) => {
    console.log(`Error ${index + 1}: ${error.error}`);
  });
}
