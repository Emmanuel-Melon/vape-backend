import { Module } from '@nestjs/common';
import { VaporizerService } from './vaporizer.service';
import { VaporizerController } from './vaporizer.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AnnotationService } from './annotation.service';
import { QuizRecommendationService } from './quiz-recommendation.service';

@Module({
  imports: [PrismaModule],
  controllers: [VaporizerController],
  providers: [VaporizerService, AnnotationService, QuizRecommendationService],
  exports: [VaporizerService, AnnotationService, QuizRecommendationService],
})
export class VaporizerModule {}
