import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as recommendationData_TEMP_REMOVE_ME from '../result.json'; // TODO: Fix this import path if needed
const recommendationData = recommendationData_TEMP_REMOVE_ME; // Handle default export if any
import {
  Prisma,
  Quiz,
  Question,
  QuestionOption,
  UserQuizAttempt,
  UserAnswer,
  QuestionType,
} from '@prisma/client';
import * as z from 'zod';

// Zod Schemas for Quiz Creation
export const QuestionOptionCreateSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  description: z.string().optional().nullable(),
  order: z.number().int().optional(),
});

export const QuestionCreateSchema = z.object({
  text: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  type: z.nativeEnum(QuestionType),
  order: z.number().int(),
  options: z.array(QuestionOptionCreateSchema).optional(), // Options are for select types
  maxRank: z.number().int().optional().nullable(),
  rangeMin: z.number().optional().nullable(),
  rangeMax: z.number().optional().nullable(),
  rangeStep: z.number().optional().nullable(),
  rangeDefault: z.number().optional().nullable(),
});

export const CreateQuizSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  questions: z
    .array(QuestionCreateSchema)
    .min(1, 'A quiz must have at least one question'),
});
export type CreateQuizInput = z.infer<typeof CreateQuizSchema>;

// Zod Schema for Submitting Quiz Answers
const BaseAnswerSchema = z.object({
  questionId: z.number().int(),
});

const SingleSelectAnswerSchema = BaseAnswerSchema.extend({
  selectedOptionValue: z.string(), // Corresponds to QuestionOption.value
});

const MultiSelectAnswerSchema = BaseAnswerSchema.extend({
  selectedOptionValues: z.array(z.string()).min(1),
});

const RankedAnswerSchema = BaseAnswerSchema.extend({
  rankedOptions: z
    .array(z.object({ optionValue: z.string(), rank: z.number().int() }))
    .min(1),
});

const RangeAnswerSchema = BaseAnswerSchema.extend({
  rangeValue: z.number(),
});

export const SubmitQuizAnswerSchema = z.object({
  questionId: z.number().int(),
  type: z.nativeEnum(QuestionType),
  selectedOptionValue: z.string().optional(), // for SINGLE_SELECT
  selectedOptionValues: z.array(z.string()).optional(), // for MULTI_SELECT
  rankedOptions: z
    .array(z.object({ optionValue: z.string(), rank: z.number().int() }))
    .optional(), // for RANKED_SELECT
  rangeValue: z.number().optional(), // for RANGE_SLIDER
});

export const SubmitQuizAttemptSchema = z.object({
  quizId: z.number().int(),
  userId: z.string(), // Assuming user ID is a string (e.g., from Supabase)
  answers: z
    .array(SubmitQuizAnswerSchema)
    .min(1, 'At least one answer must be submitted'),
});
export type SubmitQuizAttemptInput = z.infer<typeof SubmitQuizAttemptSchema>;

// Define the structure of the recommendation data based on result.json
// This is a simplified version; ideally, generate this from result.json's structure or a Zod schema
interface Recommendation {
  primaryRecommendation: any;
  alternatives: any[];
  explanation: string;
  educationalContent: any;
  matchScore: number | null;
}

export interface QuizSubmissionResponse extends UserQuizAttempt {
  primaryRecommendationId: string;
}

// Zod Schemas for User Preferences Payload (for /recommendations endpoint)
const PrioritiesSchema = z.object({
  vaporPotency: z.number().int().min(1).max(10).optional().nullable(),
  vaporComfort: z.number().int().min(1).max(10).optional().nullable(),
  portability: z.number().int().min(1).max(10).optional().nullable(),
  batteryLife: z.number().int().min(1).max(10).optional().nullable(),
  buildQuality: z.number().int().min(1).max(10).optional().nullable(),
  easeOfUse: z.number().int().min(1).max(10).optional().nullable(),
  maintenance: z.number().int().min(1).max(10).optional().nullable(),
  value: z.number().int().min(1).max(10).optional().nullable(),
});

const UserPreferencesSchema = z.object({
  cannabisExperience: z.string().optional().nullable(),
  primaryUse: z.string().optional().nullable(),
  simplicityPreference: z.string().optional().nullable(), // Assuming string, adjust if different
  discretionImportance: z.string().optional().nullable(), // Assuming string, adjust if different
  heatingMethod: z.string().optional().nullable(),
  airflowPreference: z.string().optional().nullable(),
  temperatureControl: z.string().optional().nullable(),
  usagePattern: z.string().optional().nullable(),
  userType: z.string().optional().nullable(),
  portability: z.string().optional().nullable(),
  budget: z.number().int().positive().optional().nullable(),
  priorities: PrioritiesSchema.optional().nullable(),
});

export const UserPreferencesPayloadSchema = z.object({
  metadata: z.object({
    userId: z.string().min(1, "userId is required"),
    submissionVersion: z.string().min(1, "submissionVersion is required").optional(), // e.g., 'v1.0', 'attempt-5'
    clientTimestamp: z.string().datetime({ message: "Invalid ISO 8601 datetime string" }).optional(), // ISO 8601 format
  }),
  preferences: UserPreferencesSchema,
});

export type UserPreferencesPayloadInput = z.infer<typeof UserPreferencesPayloadSchema>;

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  // --- Quiz Management ---
  async createQuiz(data: CreateQuizInput): Promise<Quiz> {
    const { title, description, questions } = data;
    return this.prisma.quiz.create({
      data: {
        title,
        description,
        questions: {
          create: questions.map((q) => ({
            text: q.text,
            subtitle: q.subtitle,
            type: q.type,
            order: q.order,
            maxRank: q.maxRank,
            rangeMin: q.rangeMin,
            rangeMax: q.rangeMax,
            rangeStep: q.rangeStep,
            rangeDefault: q.rangeDefault,
            options: q.options
              ? {
                  create: q.options.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                    description: opt.description,
                    order: opt.order,
                  })),
                }
              : undefined,
          })),
        },
      },
      include: { questions: { include: { options: true } } },
    });
  }

  async findAllQuizzes(): Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      include: {
        questions: { include: { options: true }, orderBy: { order: 'asc' } },
      },
    });
  }

  async findQuizById(id: number): Promise<Quiz | null> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: { options: { orderBy: { order: 'asc' } } },
        },
      },
    });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${id}" not found`);
    }
    return quiz;
  }

  // --- Quiz Attempt & Submission ---
  async submitAttempt(data: SubmitQuizAttemptInput): Promise<QuizSubmissionResponse> {
    const { quizId, userId, answers } = data;

    // Validate quiz and user exist
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { options: true } } },
    });
    if (!quiz) throw new NotFoundException(`Quiz with ID ${quizId} not found.`);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found.`);

    // TODO: Add more robust validation for answers against question types and options

    const createdAttempt = await this.prisma.userQuizAttempt.create({
      data: {
        userId,
        quizId,
        rawAnswersJson: answers as any, // Store raw submission
        completedAt: new Date(),
        answers: {
          create: answers.map((ans) => {
            const question = quiz.questions.find(
              (q) => q.id === ans.questionId,
            );
            if (!question)
              throw new BadRequestException(
                `Invalid questionId ${ans.questionId} for quiz ${quizId}`,
              );

            const answerData: Prisma.UserAnswerCreateWithoutUserQuizAttemptInput =
              {
                question: { connect: { id: ans.questionId } },
              };

            switch (ans.type) {
              case QuestionType.SINGLE_SELECT:
                const selectedOption = question.options.find(
                  (opt) => opt.value === ans.selectedOptionValue,
                );
                if (!selectedOption)
                  throw new BadRequestException(
                    `Invalid option value for question ${ans.questionId}`,
                  );
                answerData.selectedOption = {
                  connect: { id: selectedOption.id },
                };
                break;
              case QuestionType.MULTI_SELECT:
                answerData.selectedOptionValues = ans.selectedOptionValues;
                break;
              case QuestionType.RANKED_SELECT:
                answerData.rankedAnswersJson = ans.rankedOptions as any;
                break;
              case QuestionType.RANGE_SLIDER:
                answerData.rangeValue = ans.rangeValue;
                break;
            }
            return answerData;
          }),
        },
      },
      include: {
        answers: { include: { question: true, selectedOption: true } },
      },
    });

    return {
      ...createdAttempt,
      primaryRecommendationId: recommendationData.primaryRecommendation.id,
    };
  }

  async getUserAttempts(
    userId: string,
    quizId?: number,
  ): Promise<UserQuizAttempt[]> {
    return this.prisma.userQuizAttempt.findMany({
      where: {
        userId,
        quizId: quizId ? quizId : undefined,
      },
      include: {
        quiz: true,
        answers: {
          include: {
            question: { include: { options: true } },
            selectedOption: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
