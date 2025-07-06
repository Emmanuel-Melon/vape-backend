import { PrismaClient, Vaporizer } from '@prisma/client';
import { GeminiClient } from '../lib/llm/gemini';
import { Message } from '../lib/llm/types';

// --- Types ---
export interface ScoredVaporizer {
  vaporizer: Vaporizer;
  score: number;
  breakdown: {
    totalScore: number;
    reasoning: string; // Explanation from the LLM
  };
}

/**
 * Service to recommend vaporizers using the Gemini LLM for intelligent analysis.
 */
class VaporizerRecommenderService {
  private prisma: PrismaClient;
  private llmClient: GeminiClient;

  constructor() {
    this.prisma = new PrismaClient();
    this.llmClient = new GeminiClient();
  }

  /**
   * Generates vaporizer recommendations by sending the user's query and product data to Gemini.
   * @param query The user's natural language query.
   * @param topN The number of top recommendations to return.
   * @returns A list of the top N scored vaporizers with reasoning.
   */
  async recommend(query: string, topN = 5): Promise<ScoredVaporizer[]> {
    const vaporizers = await this.prisma.vaporizer.findMany();

    const vaporizerDataString = vaporizers
      .map((v) => JSON.stringify(this.serializeVaporizerForLLM(v)))
      .join('\n');

    const systemPrompt = `You are an expert vaporizer recommender named VaperGPT. Your goal is to help users find the perfect vaporizer based on their needs. You will be given a user's query and a list of available vaporizers in JSON format.\n\nAnalyze the user's query to understand their preferences for vibe (e.g., relaxing, social), context (e.g., at home, on the go), scenario (e.g., gaming, hiking), and technical features (e.g., portability, vapor quality, price, ease of use).\n\nThen, score each vaporizer from 0 to 100 based on how well it matches the user's query.\n\nYou MUST respond with a valid JSON object with a single key \"recommendations\", which is an array of objects. Each object must have the following structure:\n{\n  \"vaporizerId\": number,\n  \"score\": number,\n  \"reasoning\": string\n}\n\nReturn ONLY the raw JSON object, without any markdown code fences. Rank the vaporizers from highest score to lowest. Only include the top ${topN} matches.`;

    const userPrompt = `User Query: \"${query}\"\n\nAvailable Vaporizers:\n${vaporizerDataString}`;

    try {
      const messages: Message[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      const response = await this.llmClient.createChatCompletion(messages);

      // Clean the response to ensure it's valid JSON
      const cleanedContent = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
      const llmResponse = JSON.parse(cleanedContent);
      const recommendations: any[] = llmResponse.recommendations || [];

      const scoredVaporizers: ScoredVaporizer[] = recommendations
        .map((rec) => {
          const vaporizer = vaporizers.find((v) => v.id === rec.vaporizerId);
          if (!vaporizer) {
            return null;
          }
          return {
            vaporizer,
            score: rec.score,
            breakdown: {
              totalScore: rec.score,
              reasoning: rec.reasoning,
            },
          };
        })
        .filter((v): v is ScoredVaporizer => v !== null);

      return scoredVaporizers;
    } catch (error) {
      console.error('Error calling Gemini or parsing response:', error);
      throw new Error('Failed to get recommendations from the AI service.');
    }
  }

  private serializeVaporizerForLLM(vaporizer: Vaporizer): any {
    return {
      id: vaporizer.id,
      name: vaporizer.name,
      manufacturer: vaporizer.manufacturer,
      msrp: Number(vaporizer.msrp),
      heatingMethod: vaporizer.heatingMethod,
      tempControl: vaporizer.tempControl,
      expertScore: Number(vaporizer.expertScore),
      userRating: Number(vaporizer.userRating),
      bestFor: vaporizer.bestFor,
      moods: vaporizer.moods,
      contexts: vaporizer.contexts,
      scenarios: vaporizer.scenarios,
      portabilityScore: Number(vaporizer.portabilityScore),
      easeOfUseScore: Number(vaporizer.easeOfUseScore),
      discreetnessScore: Number(vaporizer.discreetnessScore),
    };
  }
}

export const vaporizerRecommenderService = new VaporizerRecommenderService();
