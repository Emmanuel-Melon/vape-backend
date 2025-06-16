import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Vaporizer, HeatingMethod, TempControl } from '@prisma/client';
import * as z from 'zod';

// Zod Schemas for Vaporizer
// Base schema for common fields
const VaporizerBaseSchema = z.object({
  slug: z.string().min(1, { message: 'Slug is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  manufacturer: z.string().optional(),
  msrp: z.number().positive().optional().nullable(), // Prisma Decimal maps to number
  releaseDate: z.coerce.date().optional().nullable(),
  heatingMethod: z.nativeEnum(HeatingMethod).optional().nullable(),
  tempControl: z.nativeEnum(TempControl).optional().nullable(),
  expertScore: z.number().min(0).max(10).optional().nullable(),
  userRating: z.number().min(0).max(5).optional().nullable(),
  bestFor: z.array(z.string()).optional(),
});

export const CreateVaporizerSchema = VaporizerBaseSchema;
export const UpdateVaporizerSchema = VaporizerBaseSchema.partial(); // All fields optional for update

// Inferred Types
export type CreateVaporizerInput = z.infer<typeof CreateVaporizerSchema>;
export type UpdateVaporizerInput = z.infer<typeof UpdateVaporizerSchema>;

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

  // Placeholder for recommendation logic - to be expanded based on requirements.md
  async getRecommendations(quizResponses: any): Promise<any[]> {
    // TODO: Implement recommendation algorithm based on quizResponses and vaporizer data
    console.log('Received quiz responses for recommendation:', quizResponses);
    // For now, return all vaporizers as a placeholder
    const allVaporizers = await this.findAll();
    return allVaporizers.map((vape) => ({
      ...vape,
      matchScore: Math.random(),
    })); // Add dummy score
  }
}
