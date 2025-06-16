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
} from '@nestjs/common';
import {
  QuizService,
  CreateQuizInput,
  CreateQuizSchema, // Added for Zod pipe
  SubmitQuizAttemptInput,
  SubmitQuizAttemptSchema, // Added for Zod pipe
  UserPreferencesPayloadInput, // Added for recommendations endpoint
  UserPreferencesPayloadSchema, // Added for Zod pipe
  QuizSubmissionResponse, // Use the new response type
} from './quiz.service';
import { Quiz, UserQuizAttempt } from '@prisma/client';
import { dummyResultsData } from '../data/dummy-results';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'; // Enabled Zod pipe

@Controller('api/quizzes')
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
  @UsePipes(new ZodValidationPipe(SubmitQuizAttemptSchema))
  async submitAttempt(
    @Body() submitAttemptDto: SubmitQuizAttemptInput,
  ): Promise<QuizSubmissionResponse> {
    return this.quizService.submitAttempt(submitAttemptDto);
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

  @Get('attempts/user/:userId')
  async getUserAttempts(
    @Param('userId') userId: string,
  ): Promise<UserQuizAttempt[]> {
    return this.quizService.getUserAttempts(userId);
  }

  @Get('attempts/user/:userId/quiz/:quizId')
  async getUserAttemptsForQuiz(
    @Param('userId') userId: string,
    @Param('quizId', ParseIntPipe) quizId: number,
  ): Promise<UserQuizAttempt[]> {
    return this.quizService.getUserAttempts(userId, quizId);
  }
}
