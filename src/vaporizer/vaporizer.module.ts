import { Module } from '@nestjs/common';
import { VaporizerService } from './vaporizer.service';
import { VaporizerController } from './vaporizer.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VaporizerController],
  providers: [VaporizerService],
  exports: [VaporizerService],
})
export class VaporizerModule {}
