# Vaper Backend - Vaporizer Recommendation System

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  Backend for a personalized vaporizer recommendation system, built with NestJS.
</p>

## Description

This project is the backend for a vaporizer recommendation system. It processes user quiz responses to generate personalized vaporizer recommendations, applies a weighted scoring algorithm against a vaporizer database, and delivers ranked results with match explanations.

## Core Features

*   Processes quiz responses to generate personalized vaporizer recommendations.
*   Applies a weighted scoring algorithm against a vaporizer database.
*   Delivers ranked results with clear match explanations.
*   Provides API endpoints for managing vaporizer data and categories.

## API Endpoints

The backend exposes the following REST API endpoints:

*   `POST /api/recommendations`:
    *   Input: JSON quiz answers
    *   Output: Ranked vaporizers with match explanations
*   `GET /api/vaporizers`:
    *   Output: Full vaporizer database
*   `PUT /api/vaporizers/{id}`:
    *   Input: Updated vaporizer JSON
    *   Output: Updated entity
*   `GET /api/categories`:
    *   Output: Predefined categories (e.g., Premium/Mid/Budget)

## Technology Stack

*   **Framework**: [NestJS](https://nestjs.com/)
*   **Language**: TypeScript
*   **Database**: PostgreSQL
*   **ORM**: [Prisma](https://www.prisma.io/)

## Backend Design Rationale

1.  **Frontend Compatibility**: Clean API boundaries are designed to match a frontend quiz structure, and the response format enables easy side-by-side comparisons.
2.  **Scalable Scoring**: Weight factors for the recommendation algorithm can be stored in configuration for easy adjustments. The rule-based system is transparent and explainable.
3.  **Admin Efficiency**: Bulk update capabilities and schema validation are planned to reduce maintenance overhead and prevent invalid data.
4.  **Performance**: Strategies like initial budget filtering and caching (e.g., for static vaporizer data) aim to optimize response times.

## Project Setup

```bash
# 1. Clone the repository (if you haven't already)
# git clone <repository-url>

# 2. Navigate to the project directory
# cd backend

# 3. Install dependencies
npm install
```

## Compile and Run the Project

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

## Run Tests

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Database Schema

The database schema is managed using Prisma. The primary table is `vaporizers`. See `prisma/schema.prisma` for the detailed schema definition.

## License

This project is [MIT licensed](./LICENSE).

