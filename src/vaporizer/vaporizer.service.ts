import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Vaporizer, HeatingMethod, TempControl } from '@prisma/client';
import { ScoredVaporizer, vaporizerRecommenderService } from './recommendation';
import * as z from 'zod';

// Zod Schemas for Vaporizer
const VaporizerBaseSchema = z.object({
  slug: z.string().min(1, { message: 'Slug is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  manufacturer: z.string().optional(),
  msrp: z.number().positive().optional().nullable(),
  releaseDate: z.coerce.date().optional().nullable(),
  heatingMethod: z.nativeEnum(HeatingMethod).optional().nullable(),
  tempControl: z.nativeEnum(TempControl).optional().nullable(),
  expertScore: z.number().min(0).max(10).optional().nullable(),
  userRating: z.number().min(0).max(5).optional().nullable(),
  bestFor: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().nullable(),
  moods: z.array(z.string()).optional(),
  contexts: z.array(z.string()).optional(),
  scenarios: z.array(z.string()).optional(),
  portabilityScore: z.number().min(0).max(10).optional().nullable(),
  easeOfUseScore: z.number().min(0).max(10).optional().nullable(),
  discreetnessScore: z.number().min(0).max(10).optional().nullable(),
});

export const CreateVaporizerSchema = VaporizerBaseSchema;
export const UpdateVaporizerSchema = VaporizerBaseSchema.partial();

export const RecommendByVibeSchema = z.object({
  text: z.string().min(10, { message: 'Query must be at least 10 characters long' }),
});

// Inferred Types
export type CreateVaporizerInput = z.infer<typeof CreateVaporizerSchema>;
export type UpdateVaporizerInput = z.infer<typeof UpdateVaporizerSchema>;
export type RecommendByVibeDto = z.infer<typeof RecommendByVibeSchema>;

@Injectable()
export class VaporizerService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVaporizerInput): Promise<Vaporizer> {
    return this.prisma.vaporizer.create({
      data,
    });
  }

  async findAll(): Promise<Vaporizer[]> {
    return this.prisma.vaporizer.findMany();
  }

  async findOne(identifier: string): Promise<Vaporizer | null> {
    const numericId = parseInt(identifier, 10);
    const isNumeric = !isNaN(numericId);

    const vaporizer = await this.prisma.vaporizer.findUnique({
      where: isNumeric ? { id: numericId } : { slug: identifier },
    });

    if (!vaporizer) {
      throw new NotFoundException(
        `Vaporizer with identifier "${identifier}" not found`,
      );
    }
    return vaporizer;
  }

  async update(id: number, data: UpdateVaporizerInput): Promise<Vaporizer> {
    try {
      return await this.prisma.vaporizer.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Vaporizer with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<Vaporizer> {
    try {
      return await this.prisma.vaporizer.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Vaporizer with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Generates vaporizer recommendations based on a natural language query.
   * @param query The user's query describing their needs and vibe.
   * @returns A list of scored and ranked vaporizer recommendations.
   */
  async recommendByVibe(query: RecommendByVibeDto): Promise<ScoredVaporizer[]> {
    // The new recommender service takes the raw text directly.
    return vaporizerRecommenderService.recommend(query.text);
  }
}
