import { z } from 'zod';

/**
 * Schema for validating quiz-based recommendation requests
 */
export const recommendByQuizSchema = z.object({
  mood: z.string().optional(),
  context: z.string().optional(),
  experience: z.string().optional(),
  frequency: z.string().optional(),
  budget: z.string().optional(),
  heatingMethod: z.string().optional(),
  tempControl: z.string().optional(),
  portability: z.string().optional(),
  discreetness: z.string().optional(),
  deliveryMethod: z.string().optional(),
});

/**
 * Type for quiz-based recommendation requests
 */
export type RecommendByQuizDto = z.infer<typeof recommendByQuizSchema>;
