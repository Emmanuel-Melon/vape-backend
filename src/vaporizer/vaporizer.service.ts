import { Injectable, NotFoundException } from '@nestjs/common';
import { findIdsByNames } from '../../prisma/utils';
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

  /* already present */
  moods: z.array(z.string()).optional(),
  contexts: z.array(z.string()).optional(),
  scenarios: z.array(z.string()).optional(),

  /* NEW */
  deliveryMethods: z.array(z.string()).optional(),

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
    const { moods, contexts, scenarios, bestFor, deliveryMethods, ...vapeData } = data;

    const created = await this.prisma.vaporizer.create({ data: vapeData });

    // Link controlled vocabularies if provided
    await this.linkVocabularies(created.id, { moods, contexts, scenarios, bestFor, deliveryMethods });

    return created;
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
      const { moods, contexts, scenarios, bestFor, deliveryMethods, ...vapeData } = data;

      const updated = await this.prisma.vaporizer.update({
        where: { id },
        data: vapeData,
      });

      // Re-link vocabularies (simple approach: delete old links then recreate)
      await this.prisma.moodToVaporizer.deleteMany({ where: { vaporizerId: id } });
      await this.prisma.contextToVaporizer.deleteMany({ where: { vaporizerId: id } });
      await this.prisma.scenarioToVaporizer.deleteMany({ where: { vaporizerId: id } });
      await this.prisma.bestForToVaporizer.deleteMany({ where: { vaporizerId: id } });
      await this.prisma.deliveryMethodToVaporizer.deleteMany({ where: { vaporizerId: id } });

      await this.linkVocabularies(id, { moods, contexts, scenarios, bestFor, deliveryMethods });

      return updated;
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
   * Links controlled vocabulary names to the vaporizer via junction tables.
   */
  private async linkVocabularies(
    vaporizerId: number,
    vocab: {
      moods?: string[];
      contexts?: string[];
      scenarios?: string[];
      bestFor?: string[];
      deliveryMethods?: string[];
    },
  ): Promise<void> {
    const {
      moods = [],
      contexts = [],
      scenarios = [],
      bestFor = [],
      deliveryMethods = [],
    } = vocab;

    // Fetch all vocab rows in parallel
    const [allMoods, allContexts, allScenarios, allBestFors, allDeliveries] = await Promise.all([
      this.prisma.mood.findMany({ select: { id: true, name: true } }),
      this.prisma.context.findMany({ select: { id: true, name: true } }),
      this.prisma.scenario.findMany({ select: { id: true, name: true } }),
      this.prisma.bestFor.findMany({ select: { id: true, name: true } }),
      this.prisma.deliveryMethod.findMany({ select: { id: true, name: true } }),
    ]);

    const moodIds = findIdsByNames(allMoods, moods);
    await Promise.all(
      moodIds.map((moodId) =>
        this.prisma.moodToVaporizer.create({ data: { moodId, vaporizerId } }),
      ),
    );

    const contextIds = findIdsByNames(allContexts, contexts);
    await Promise.all(
      contextIds.map((contextId) =>
        this.prisma.contextToVaporizer.create({ data: { contextId, vaporizerId } }),
      ),
    );

    const scenarioIds = findIdsByNames(allScenarios, scenarios);
    await Promise.all(
      scenarioIds.map((scenarioId) =>
        this.prisma.scenarioToVaporizer.create({ data: { scenarioId, vaporizerId } }),
      ),
    );

    const bestForIds = findIdsByNames(allBestFors, bestFor);
    await Promise.all(
      bestForIds.map((bestForId) =>
        this.prisma.bestForToVaporizer.create({ data: { bestForId, vaporizerId } }),
      ),
    );

    const deliveryIds = findIdsByNames(allDeliveries, deliveryMethods);
    await Promise.all(
      deliveryIds.map((deliveryMethodId) =>
        this.prisma.deliveryMethodToVaporizer.create({
          data: { deliveryMethodId, vaporizerId },
        }),
      ),
    );
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
