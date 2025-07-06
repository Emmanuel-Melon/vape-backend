import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseGuards, // Added
  Req,       // Added
} from '@nestjs/common';
import { Request } from 'express'; // Added
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Added
import { User } from '../users/entities/user.entity'; // Added for req.user typing
import {
  QuizService,
  CreateQuizInput,
  CreateQuizSchema, // Added for Zod pipe
  SubmitQuizAttemptInput,     // Type for service method
  SubmitQuizAttemptBodySchema, // Schema for request body validation (no userId)
  // SubmitQuizAttemptSchema,  // Original schema (with userId) - no longer directly used by controller pipe
  UserPreferencesPayloadInput, // Added for recommendations endpoint
  UserPreferencesPayloadSchema, // Added for Zod pipe
  QuizSubmissionResponse, // Use the new response type
} from './quiz.service';
import { Quiz, UserQuizAttempt } from '@prisma/client';
import { dummyResultsData } from '../data/dummy-results';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'; // Enabled Zod pipe

@Controller('api/quizzes')
@UseGuards(JwtAuthGuard) // Apply guard to the entire controller
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(CreateQuizSchema))
  async createQuiz(@Body() createQuizDto: CreateQuizInput): Promise<Quiz> {
    return this.quizService.createQuiz(createQuizDto);
  }

  @Get()
  async findAllQuizzes(): Promise<Quiz[]> {
    return this.quizService.findAllQuizzes();
  }

  @Get(':id')
  async findQuizById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Quiz | null> {
    return this.quizService.findQuizById(id);
  }

  @Post('attempts')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(SubmitQuizAttemptBodySchema)) // Changed to use BodySchema
  async submitAttempt(
    @Req() req: Request,
    @Body() submitAttemptDto: Omit<SubmitQuizAttemptInput, 'userId'>, // userId will come from req.user
  ): Promise<QuizSubmissionResponse> {
    const user = req.user as User;
    // We'll need to adjust quizService.submitAttempt to accept userId as a parameter
    // and the DTO to not expect userId from the body.
    return this.quizService.submitAttempt({ ...submitAttemptDto, userId: user.id });
  }

  @Post('recommendations')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(UserPreferencesPayloadSchema))
  async getRecommendations(
    @Body() userPreferences: UserPreferencesPayloadInput,
  ): Promise<any> {
    // TODO: Implement logic to process userPreferences and generate recommendations.
    // For now, just returning dummy data after validation.
    // The previous call to this.quizService.submitAttempt(userPreferences) was removed
    // because UserPreferencesPayloadInput is not compatible with SubmitQuizAttemptInput.
    // If preferences need to be stored as an attempt, a new service method or mapping logic is required.
    console.log('Received user preferences:', userPreferences); // Optional: log received data
    return dummyResultsData;
  }

  @Get('attempts/me') // Changed route
  async getMyAttempts(@Req() req: Request): Promise<UserQuizAttempt[]> {
    const user = req.user as User;
    return this.quizService.getUserAttempts(user.id);
  }

  @Get('attempts/me/quiz/:quizId') // Changed route
  async getMyAttemptsForQuiz(
    @Req() req: Request,
    @Param('quizId', ParseIntPipe) quizId: number,
  ): Promise<UserQuizAttempt[]> {
    const user = req.user as User;
    return this.quizService.getUserAttempts(user.id, quizId);
  }
}
