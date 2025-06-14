// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper method to clean the database during testing
  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'production') {
      // The transaction ensures we delete in the correct order regarding foreign keys
      return this.$transaction([
        this.user.deleteMany(),
      ]);
    }
  }

  // Helper method for handling Prisma errors in a consistent way
  async executeWithErrorHandling<T>(callback: () => Promise<T>): Promise<T> {
    try {
      return await callback();
    } catch (error) {
      // Log the error
      console.error('Prisma error:', error);
      
      // You can add custom error handling logic here
      if (error.code === 'P2002') {
        throw new Error('A unique constraint would be violated on this operation.');
      }
      
      if (error.code === 'P2025') {
        throw new Error('Record not found.');
      }
      
      // Re-throw the error
      throw error;
    }
  }
}