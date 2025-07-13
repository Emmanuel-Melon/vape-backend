import { HeatingMethod, TempControl, QuestionType } from '@prisma/client';
import { 
  UserPreferences, 
  ExperienceLevel, 
  UsageFrequency, 
  QuizAnswerMappingResult 
} from './types';

/**
 * Maps quiz answers to user preferences for vaporizer recommendation
 */
export class QuizMapper {
  /**
   * Maps a mood preference answer to the corresponding mood vocabulary terms
   * 
   * @param answer The user's selected mood preference
   * @returns Mapping result with mood preferences
   */
  mapMoodPreference(answer: string): QuizAnswerMappingResult {
    // Default empty preferences
    const preferences: Partial<UserPreferences> = {
      moods: []
    };

    try {
      // Map the answer to the corresponding mood
      switch (answer.toLowerCase()) {
        case 'relaxed':
          preferences.moods = ['relaxed'];
          break;
        case 'energetic':
          preferences.moods = ['energetic'];
          break;
        case 'creative':
          preferences.moods = ['creative'];
          break;
        case 'focused':
          preferences.moods = ['focused'];
          break;
        case 'sleepy':
          preferences.moods = ['sleepy'];
          break;
        case 'euphoric':
          preferences.moods = ['euphoric'];
          break;
        case 'happy':
          preferences.moods = ['happy'];
          break;
        default:
          // If no direct mapping exists, return an error
          return {
            success: false,
            error: `Unknown mood preference: ${answer}`
          };
      }

      return {
        success: true,
        preferences
      };
    } catch (error) {
      return {
        success: false,
        error: `Error mapping mood preference: ${error.message}`
      };
    }
  }

  /**
   * Maps a usage context answer to the corresponding context and scenario vocabulary terms
   * 
   * @param answer The user's selected usage context
   * @returns Mapping result with context and scenario preferences
   */
  mapUsageContext(answer: string): QuizAnswerMappingResult {
    // Default empty preferences
    const preferences: Partial<UserPreferences> = {
      contexts: [],
      scenarios: []
    };

    try {
      // Map the answer to the corresponding context and scenario
      switch (answer.toLowerCase()) {
        case 'at home':
          preferences.contexts = ['home'];
          // Lower portability importance for home use
          preferences.portabilityImportance = 3; // Low importance (1-10 scale)
          break;
        case 'on the go':
          preferences.scenarios = ['on_the_go'];
          // Higher portability and discreteness for on-the-go use
          preferences.portabilityImportance = 9; // High importance
          preferences.discreetnessImportance = 8; // High importance
          break;
        case 'social gatherings':
          preferences.contexts = ['social_gathering'];
          preferences.bestFor = ['group_sessions'];
          break;
        case 'medical relief':
          preferences.contexts = ['medical_relief'];
          // Medical users typically need precise temperature control
          preferences.tempControlPreference = TempControl.DIGITAL;
          break;
        case 'outdoor activities':
          preferences.scenarios = ['outdoor_activity'];
          // Outdoor use requires portability and durability
          preferences.portabilityImportance = 8; // High importance
          break;
        case 'in a vehicle':
          preferences.scenarios = ['in_the_car'];
          // Vehicle use requires high discreteness and quick heat-up
          preferences.discreetnessImportance = 9; // High importance
          break;
        default:
          // If no direct mapping exists, return an error
          return {
            success: false,
            error: `Unknown usage context: ${answer}`
          };
      }

      return {
        success: true,
        preferences
      };
    } catch (error) {
      return {
        success: false,
        error: `Error mapping usage context: ${error.message}`
      };
    }
  }

  /**
   * Maps an experience level answer to the corresponding user profile and feature preferences
   * 
   * @param answer The user's selected experience level
   * @returns Mapping result with experience level and feature preferences
   */
  mapExperienceLevel(answer: string): QuizAnswerMappingResult {
    // Default empty preferences
    const preferences: Partial<UserPreferences> = {
      bestFor: []
    };

    try {
      // Map the answer to the corresponding experience level
      switch (answer.toLowerCase()) {
        case 'complete beginner':
          preferences.experienceLevel = ExperienceLevel.BEGINNER;
          preferences.bestFor = ['beginner_friendly'];
          // Beginners typically need simpler devices with good ease of use
          break;
        case 'some experience':
          preferences.experienceLevel = ExperienceLevel.INTERMEDIATE;
          // Balanced approach for intermediate users
          break;
        case 'experienced user':
          preferences.experienceLevel = ExperienceLevel.EXPERIENCED;
          preferences.bestFor = ['heavy_user'];
          // Experienced users typically want more advanced features
          break;
        case 'expert/enthusiast':
          preferences.experienceLevel = ExperienceLevel.EXPERT;
          // Experts typically prioritize technical specifications and customization
          break;
        default:
          // If no direct mapping exists, return an error
          return {
            success: false,
            error: `Unknown experience level: ${answer}`
          };
      }

      return {
        success: true,
        preferences
      };
    } catch (error) {
      return {
        success: false,
        error: `Error mapping experience level: ${error.message}`
      };
    }
  }

  /**
   * Maps a usage frequency answer to the corresponding user profile and feature preferences
   * 
   * @param answer The user's selected usage frequency
   * @returns Mapping result with usage frequency and feature preferences
   */
  mapUsageFrequency(answer: string): QuizAnswerMappingResult {
    // Default empty preferences
    const preferences: Partial<UserPreferences> = {
      contexts: [],
      bestFor: []
    };

    try {
      // Map the answer to the corresponding usage frequency
      switch (answer.toLowerCase()) {
        case 'rarely (special occasions)':
          preferences.usageFrequency = UsageFrequency.RARELY;
          preferences.contexts = ['special_occasion'];
          // For rare use, ease of use is more important than durability
          break;
        case 'occasionally (few times a month)':
          preferences.usageFrequency = UsageFrequency.OCCASIONALLY;
          // Balanced approach for occasional users
          break;
        case 'regularly (few times a week)':
          preferences.usageFrequency = UsageFrequency.REGULARLY;
          preferences.bestFor = ['daily_use'];
          // Regular users need reliable devices with good build quality
          break;
        case 'daily':
          preferences.usageFrequency = UsageFrequency.DAILY;
          preferences.bestFor = ['heavy_user'];
          // Daily users need durable devices with good build quality
          break;
        case 'multiple times daily':
          preferences.usageFrequency = UsageFrequency.MULTIPLE_DAILY;
          preferences.bestFor = ['heavy_user'];
          // Heavy users need top-tier durability and quick heat-up
          break;
        default:
          // If no direct mapping exists, return an error
          return {
            success: false,
            error: `Unknown usage frequency: ${answer}`
          };
      }

      return {
        success: true,
        preferences
      };
    } catch (error) {
      return {
        success: false,
        error: `Error mapping usage frequency: ${error.message}`
      };
    }
  }

  /**
   * Maps a budget range answer to price constraints
   * 
   * @param answer The user's selected budget range
   * @returns Mapping result with budget constraints
   */
  mapBudgetRange(answer: string): QuizAnswerMappingResult {
    // Default empty preferences
    const preferences: Partial<UserPreferences> = {};

    try {
      // Map the answer to the corresponding budget range
      switch (answer.toLowerCase()) {
        case 'under $100':
          preferences.minBudget = 0;
          preferences.maxBudget = 99.99;
          break;
        case '$100-$200':
          preferences.minBudget = 100;
          preferences.maxBudget = 199.99;
          break;
        case '$200-$300':
          preferences.minBudget = 200;
          preferences.maxBudget = 299.99;
          break;
        case '$300-$500':
          preferences.minBudget = 300;
          preferences.maxBudget = 499.99;
          break;
        case '$500+':
          preferences.minBudget = 500;
          preferences.maxBudget = Number.MAX_SAFE_INTEGER;
          break;
        default:
          // If no direct mapping exists, return an error
          return {
            success: false,
            error: `Unknown budget range: ${answer}`
          };
      }

      return {
        success: true,
        preferences
      };
    } catch (error) {
      return {
        success: false,
        error: `Error mapping budget range: ${error.message}`
      };
    }
  }

  /**
   * Maps a heating method preference answer to the corresponding heating method
   * 
   * @param answer The user's selected heating method preference
   * @returns Mapping result with heating method preference
   */
  mapHeatingMethodPreference(answer: string): QuizAnswerMappingResult {
    // Default empty preferences
    const preferences: Partial<UserPreferences> = {};

    try {
      // Map the answer to the corresponding heating method
      switch (answer.toLowerCase()) {
        case 'conduction':
          preferences.heatingMethodPreference = HeatingMethod.CONDUCTION;
          break;
        case 'convection':
          preferences.heatingMethodPreference = HeatingMethod.CONVECTION;
          break;
        case 'hybrid':
          preferences.heatingMethodPreference = HeatingMethod.HYBRID;
          break;
        case 'no preference':
        case 'i don\'t know':
          preferences.heatingMethodPreference = null; // No specific preference
          break;
        default:
          // If no direct mapping exists, return an error
          return {
            success: false,
            error: `Unknown heating method preference: ${answer}`
          };
      }

      return {
        success: true,
        preferences
      };
    } catch (error) {
      return {
        success: false,
        error: `Error mapping heating method preference: ${error.message}`
      };
    }
  }

  /**
   * Maps a temperature control importance answer to the corresponding temperature control preference
   * 
   * @param answer The user's selected temperature control importance
   * @returns Mapping result with temperature control preference
   */
  mapTemperatureControlImportance(answer: string): QuizAnswerMappingResult {
    // Default empty preferences
    const preferences: Partial<UserPreferences> = {};

    try {
      // Map the answer to the corresponding temperature control preference
      switch (answer.toLowerCase()) {
        case 'very important':
          // User wants precise control, digital or app-based
          preferences.tempControlPreference = TempControl.DIGITAL; // Could also be APP
          break;
        case 'somewhat important':
          // User wants some control, digital with presets is fine
          preferences.tempControlPreference = TempControl.DIGITAL;
          break;
        case 'not important':
          // User doesn't care about precise control, preset or analog is fine
          preferences.tempControlPreference = null; // No specific preference
          break;
        default:
          // If no direct mapping exists, return an error
          return {
            success: false,
            error: `Unknown temperature control importance: ${answer}`
          };
      }

      return {
        success: true,
        preferences
      };
    } catch (error) {
      return {
        success: false,
        error: `Error mapping temperature control importance: ${error.message}`
      };
    }
  }

  /**
   * Maps a portability importance answer to a portability score range
   * 
   * @param answer The user's selected portability importance
   * @returns Mapping result with portability importance score
   */
  mapPortabilityImportance(answer: string): QuizAnswerMappingResult {
    // Default empty preferences
    const preferences: Partial<UserPreferences> = {};

    try {
      // Map the answer to the corresponding portability importance
      switch (answer.toLowerCase()) {
        case 'very important':
          preferences.portabilityImportance = 9; // High importance (8-10 range)
          break;
        case 'somewhat important':
          preferences.portabilityImportance = 6; // Medium importance (5-7 range)
          break;
        case 'not important':
          preferences.portabilityImportance = 3; // Low importance (1-4 range)
          break;
        default:
          // If no direct mapping exists, return an error
          return {
            success: false,
            error: `Unknown portability importance: ${answer}`
          };
      }

      return {
        success: true,
        preferences
      };
    } catch (error) {
      return {
        success: false,
        error: `Error mapping portability importance: ${error.message}`
      };
    }
  }

  /**
   * Maps a discreteness importance answer to a discreteness score range
   * 
   * @param answer The user's selected discreteness importance
   * @returns Mapping result with discreteness importance score
   */
  mapDiscreetnessImportance(answer: string): QuizAnswerMappingResult {
    // Default empty preferences
    const preferences: Partial<UserPreferences> = {};

    try {
      // Map the answer to the corresponding discreteness importance
      switch (answer.toLowerCase()) {
        case 'very important':
          preferences.discreetnessImportance = 9; // High importance (8-10 range)
          break;
        case 'somewhat important':
          preferences.discreetnessImportance = 6; // Medium importance (5-7 range)
          break;
        case 'not important':
          preferences.discreetnessImportance = 3; // Low importance (1-4 range)
          break;
        default:
          // If no direct mapping exists, return an error
          return {
            success: false,
            error: `Unknown discreteness importance: ${answer}`
          };
      }

      return {
        success: true,
        preferences
      };
    } catch (error) {
      return {
        success: false,
        error: `Error mapping discreteness importance: ${error.message}`
      };
    }
  }

  /**
   * Maps a delivery method preference answer to the corresponding delivery method
   * 
   * @param answer The user's selected delivery method preference
   * @returns Mapping result with delivery method preference
   */
  mapDeliveryMethodPreference(answer: string): QuizAnswerMappingResult {
    // Default empty preferences
    const preferences: Partial<UserPreferences> = {
      deliveryMethods: []
    };

    try {
      // Map the answer to the corresponding delivery method
      switch (answer.toLowerCase()) {
        case 'direct draw':
          preferences.deliveryMethods = ['direct_draw'];
          break;
        case 'through water':
          preferences.deliveryMethods = ['water_pipe_compatible'];
          break;
        case 'balloon/bag':
          preferences.deliveryMethods = ['balloon'];
          break;
        case 'whip/tube':
          preferences.deliveryMethods = ['whip'];
          break;
        default:
          // If no direct mapping exists, return an error
          return {
            success: false,
            error: `Unknown delivery method preference: ${answer}`
          };
      }

      return {
        success: true,
        preferences
      };
    } catch (error) {
      return {
        success: false,
        error: `Error mapping delivery method preference: ${error.message}`
      };
    }
  }
}
