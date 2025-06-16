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
} from '@nestjs/common';
import {
  VaporizerService,
  CreateVaporizerInput,
  UpdateVaporizerInput,
} from './vaporizer.service';
import { Vaporizer } from '@prisma/client';
// import { ZodValidationPipe } from '../pipes/zod-validation.pipe'; // Assuming a Zod pipe might be created

@Controller('api/vaporizers')
export class VaporizerController {
  constructor(private readonly vaporizerService: VaporizerService) {}

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

  // Endpoint for recommendations as per requirements.md (POST /api/recommendations)
  // This might live in its own controller (e.g., recommendations.controller.ts) eventually
  // For now, placing a simplified version here, assuming it uses VaporizerService.
  @Post('/recommendations') // Note: Route might be POST /api/recommendations, adjust controller prefix or method route
  @HttpCode(HttpStatus.OK)
  async getRecommendations(@Body() quizResponses: any): Promise<any[]> {
    // In a real app, quizResponses would also be validated using a Zod schema
    return this.vaporizerService.getRecommendations(quizResponses);
  }
}
