import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  VaporizerService,
  CreateVaporizerInput,
  UpdateVaporizerInput,
  RecommendByVibeDto,
} from './vaporizer.service';
import { QuizRecommendationService } from './quiz-recommendation.service';
import { RecommendByQuizDto, recommendByQuizSchema } from './dto/recommend-by-quiz.dto';
import { Vaporizer } from '@prisma/client';
import { uploadVaporizerImage } from './operations/upload';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { AnnotationService } from './annotation.service';
import {
  CreateAnnotationDto,
  createAnnotationSchema,
} from './dto/create-annotation.dto';

@Controller('api/vaporizers')
export class VaporizerController {
  constructor(
    private readonly vaporizerService: VaporizerService,
    private readonly annotationService: AnnotationService,
    private readonly quizRecommendationService: QuizRecommendationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // create(@Body(new ZodValidationPipe(CreateVaporizerSchema)) createVaporizerDto: CreateVaporizerInput): Promise<Vaporizer> {
  async create(
    @Body() createVaporizerDto: CreateVaporizerInput,
  ): Promise<Vaporizer> {
    // Placeholder for Zod pipe
    return this.vaporizerService.create(createVaporizerDto);
  }

  @Get()
  async findAll(): Promise<Vaporizer[]> {
    return this.vaporizerService.findAll();
  }

  @Get(':identifier')
  async findOne(
    @Param('identifier') identifier: string,
  ): Promise<Vaporizer | null> {
    return this.vaporizerService.findOne(identifier.toString());
  }

  @Put(':id')
  // update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(UpdateVaporizerSchema)) updateVaporizerDto: UpdateVaporizerInput): Promise<Vaporizer> {
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVaporizerDto: UpdateVaporizerInput,
  ): Promise<Vaporizer> {
    // Placeholder for Zod pipe
    return this.vaporizerService.update(id, updateVaporizerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.vaporizerService.remove(id);
  }

  @Post('recommend-by-vibe')
  @HttpCode(HttpStatus.OK)
  async recommendByVibe(@Body() data: RecommendByVibeDto) {
    // In a real app, this DTO would be validated using a Zod pipe
    return this.vaporizerService.recommendByVibe(data);
  }

  @Post('recommend-by-quiz')
  @HttpCode(HttpStatus.OK)
  async recommendByQuiz(@Body(new ZodValidationPipe(recommendByQuizSchema)) data: RecommendByQuizDto) {
    return this.quizRecommendationService.recommendByQuiz(data);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return uploadVaporizerImage(file, { vaporizerId: id });
  }

  @Post(':id/annotations')
  @HttpCode(HttpStatus.CREATED)
  async createAnnotation(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(createAnnotationSchema))
    createAnnotationDto: CreateAnnotationDto,
  ) {
    return this.annotationService.create(id, createAnnotationDto);
  }
}
