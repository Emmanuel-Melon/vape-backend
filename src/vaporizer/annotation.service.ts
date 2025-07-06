import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnnotationDto } from './dto/create-annotation.dto';

@Injectable()
export class AnnotationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(vaporizerId: number, createAnnotationDto: CreateAnnotationDto) {
    const vaporizer = await this.prisma.vaporizer.findUnique({
      where: { id: vaporizerId },
    });

    if (!vaporizer) {
      throw new NotFoundException(`Vaporizer with ID ${vaporizerId} not found.`);
    }

    return this.prisma.annotation.create({
      data: {
        vaporizerId: vaporizerId,
        type: createAnnotationDto.type,
        text: createAnnotationDto.text,
      },
    });
  }
}
