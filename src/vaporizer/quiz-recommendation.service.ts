import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecommendByQuizDto } from './dto/recommend-by-quiz.dto';
import { getVaporizerRecommendations } from '../lib/recommendation';
import { VaporizerWithRelations, RecommendationResult } from '../lib/recommendation/utils';
import { vaporizerData } from '../../prisma/data';

/**
 * Service for handling quiz-based vaporizer recommendations
 */
@Injectable()
export class QuizRecommendationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get vaporizer recommendations based on quiz answers
   * 
   * @param quizAnswers - The answers from the quiz
   * @returns Object containing user preferences and scored recommendations
   */
  async recommendByQuiz(quizAnswers: RecommendByQuizDto): Promise<{
    userPreferences: any;
    recommendations: RecommendationResult[];
  }> {
    try {
      // In a real implementation, we would fetch vaporizers from the database
      // For now, we're using the sample data as specified
      const vaporizers = this.convertVaporizersForScoring(vaporizerData);
      
      // Use the recommendation algorithm from the lib directory
      const result = await getVaporizerRecommendations(quizAnswers, vaporizers);
      
      return result;
    } catch (error) {
      console.error('Error in quiz recommendation process:', error);
      throw new Error(`Quiz recommendation process failed: ${error.message}`);
    }
  }

  /**
   * Convert vaporizers from the database format to the format expected by the scoring algorithm
   * 
   * @param vaporizerData - The vaporizer data from the database
   * @returns Vaporizers in the format expected by the scoring algorithm
   */
  private convertVaporizersForScoring(vaporizerData: any[]): VaporizerWithRelations[] {
    return vaporizerData.map((vaporizer, index) => {
      // Convert string arrays to objects with id and name properties
      const formatCategoryItems = (items: string[] = []): { id: number; name: string }[] => {
        return items.map((item, idx) => ({
          id: idx + 1,
          name: item
        }));
      };

      return {
        id: index + 1,
        name: vaporizer.name,
        slug: vaporizer.name.toLowerCase().replace(/\s+/g, '-'),
        description: `${vaporizer.category || ''} vaporizer by ${vaporizer.manufacturer || ''}`,
        currentPrice: vaporizer.currentPrice || vaporizer.msrp,
        heatingMethod: vaporizer.heatingMethod,
        tempControl: vaporizer.tempControl,
        portabilityScore: vaporizer.portabilityScore,
        discreetnessScore: vaporizer.discreetnessScore,
        // Convert string arrays to objects with id and name
        moods: formatCategoryItems(vaporizer.moods),
        contexts: formatCategoryItems(vaporizer.contexts),
        scenarios: formatCategoryItems(vaporizer.scenarios),
        bestFor: formatCategoryItems(vaporizer.bestFor),
        deliveryMethods: formatCategoryItems(vaporizer.deliveryMethods)
      };
    });
  }
}
