# Application Structure Blueprint

This document outlines the standard structure for adding new features (modules) to the backend application, based on the existing `auth` module.

## Core Module Structure

Each primary feature or domain in the application should be organized into its own NestJS module. A typical module, for example, `featureName`, will reside in `src/featureName/` and consist of the following core files:

1.  **`featureName.module.ts`**: 
    *   Defines the NestJS module using the `@Module()` decorator.
    *   Imports any other modules that `featureName` depends on (e.g., `PrismaModule`).
    *   Declares controllers (`featureName.controller.ts`) that belong to this module.
    *   Declares providers (`featureName.service.ts`) that belong to this module.
    *   Exports any providers (typically the service) if they need to be used by other modules.

2.  **`featureName.controller.ts`**: 
    *   Handles incoming HTTP requests for the feature.
    *   Uses decorators like `@Controller('feature-route-prefix')`, `@Get()`, `@Post()`, `@Body()`, `@Param()`, etc.
    *   Injects and uses the `featureName.service.ts` to handle business logic.
    *   **Input Validation**: Uses NestJS pipes (e.g., `ValidationPipe`) in conjunction with Zod schemas for validating request bodies, query parameters, and path parameters. DTOs (Data Transfer Objects) are defined using Zod schemas, and TypeScript types are inferred from these schemas.

3.  **`featureName.service.ts`**: 
    *   Contains the core business logic for the feature.
    *   Marked with `@Injectable()`.
    *   May inject other services (e.g., `PrismaService`) or providers.
    *   Interacts with the database (via `PrismaService` or other data access layers).
    *   Receives data that has already been validated by the controller layer.
    *   Defines input types for its methods using Zod-inferred types (exported from the same file or a dedicated `dto.ts` or `types.ts` within the module if schemas become numerous).

## Example: Auth Module (`src/auth/`)

*   **`auth.module.ts`**: Imports `PrismaModule`, declares `AuthController` and `AuthService`, exports `AuthService`.
*   **`auth.controller.ts`**: Defines routes like `/auth/register`, `/auth/login`. Uses `ValidationPipe` with Zod schemas for request body validation.
*   **`auth.service.ts`**: 
    *   Handles user registration, login, magic link generation.
    *   Injects `PrismaService` for database interaction and `supabase` client for Supabase Auth operations.
    *   Defines `RegisterSchema`, `LoginSchema`, `MagicLinkEmailSchema` using Zod for input data structures.
    *   Infers `RegisterInput`, `LoginInput`, `MagicLinkEmailInput` types from these Zod schemas.

## Data Transfer Objects (DTOs) and Validation

*   **Zod Schemas**: Define the shape and validation rules for input data (e.g., request bodies).
    *   These schemas are typically defined in the `service.ts` file if closely tied to service inputs, or in a separate `dto/` subdirectory or `*.dto.ts` file within the module for better organization if there are many.
*   **Type Inference**: TypeScript types for DTOs are inferred from Zod schemas using `z.infer<typeof schemaName>`.
*   **Validation Pipe**: NestJS's `ValidationPipe` (often configured globally in `main.ts` or locally in controllers) is used to automatically validate incoming request data against these Zod schemas (usually via a custom pipe adapter for Zod or a library like `nestjs-zod`).

## General Principles

*   **Separation of Concerns**: Controllers handle HTTP layer, services handle business logic, modules organize related components.
*   **Dependency Injection**: Leverage NestJS's DI system.
*   **Type Safety**: Use TypeScript and Zod-inferred types throughout.

This structure provides a consistent and maintainable way to develop new features.
