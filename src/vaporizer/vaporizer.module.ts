import { Module } from '@nestjs/common';
import { VaporizerService } from './vaporizer.service';
import { VaporizerController } from './vaporizer.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AnnotationService } from './annotation.service';

@Module({
  imports: [PrismaModule],
  controllers: [VaporizerController],
  providers: [VaporizerService, AnnotationService],
  exports: [VaporizerService, AnnotationService],
})
export class VaporizerModule {}
