# API Payload Documentation

This document outlines the structure of request and response payloads for the quiz API.

## 1. Create Quiz Definition

This payload is used to define a new quiz, including its title, description, and all its questions.

**Endpoint:** `POST /api/quizzes`
**Content-Type:** `application/json`

### Request Payload Example

```json
{
  "title": "Vaporizer Style Quiz",
  "description": "Find your perfect vaporizer style.",
  "questions": [
    {
      "text": "What's your level of cannabis experience?",
      "type": "SINGLE_SELECT",
      "order": 1,
      "options": [
        { "label": "Novice", "value": "novice", "order": 1 },
        { "label": "Experienced", "value": "experienced", "order": 2 },
        { "label": "Expert", "value": "expert", "order": 3 }
      ]
    },
    {
      "text": "What's your primary use for a vaporizer?",
      "type": "SINGLE_SELECT",
      "order": 2,
      "options": [
        { "label": "Medical", "value": "medical", "order": 1 },
        { "label": "Recreational", "value": "recreational", "order": 2 },
        { "label": "Both", "value": "both", "order": 3 }
      ]
    },
    {
      "text": "How often do you use cannabis?",
      "type": "SINGLE_SELECT",
      "order": 3,
      "options": [
        { "label": "Occasionally", "value": "occasional", "order": 1 },
        { "label": "Weekly", "value": "weekly", "order": 2 },
        { "label": "Daily", "value": "daily", "order": 3 }
      ]
    },
    {
      "text": "How portable should your vaporizer be?",
      "type": "SINGLE_SELECT",
      "order": 4,
      "options": [
        { "label": "Desktop/Home Use", "value": "desktop", "order": 1 },
        { "label": "Portable", "value": "portable", "order": 2 }
      ]
    },
    {
      "text": "What's your budget?",
      "type": "RANGE_SLIDER",
      "order": 5,
      "subtitle": "Enter your budget in USD",
      "rangeMin": 50,
      "rangeMax": 1000,
      "rangeStep": 10,
      "rangeDefault": 200
    },
    {
      "text": "Rate your vaporizer priorities (1 = least important, 5 = most important)",
      "type": "RANKED_SELECT",
      "order": 6,
      "subtitle": "Drag and drop to rank, or select a rank for each.",
      "options": [
        { "label": "Vapor Potency", "value": "vaporPotency", "order": 1 },
        { "label": "Vapor Comfort", "value": "vaporComfort", "order": 2 },
        { "label": "Portability", "value": "portability", "order": 3 },
        { "label": "Battery Life", "value": "batteryLife", "order": 4 },
        { "label": "Build Quality", "value": "buildQuality", "order": 5 },
        { "label": "Ease of Use", "value": "easeOfUse", "order": 6 },
        { "label": "Maintenance", "value": "maintenance", "order": 7 },
        { "label": "Value for Money", "value": "value", "order": 8 }
      ],
      "maxRank": 8
    }
  ]
}
```

### Request Field Descriptions

#### Root Object
- `title` (string, required): The main title of the quiz.
- `description` (string, optional): A brief description of the quiz.
- `questions` (array of Question objects, required, min 1 item): A list of questions for the quiz.

#### Question Object
- `text` (string, required): The main text of the question.
- `subtitle` (string, optional): Additional text or clarification for the question.
- `type` (enum string, required): The type of question. Valid types are:
    - `WELCOME`: A welcome or informational screen.
    - `SINGLE_SELECT`: User selects one option. Requires `options`.
    - `MULTI_SELECT`: User selects multiple options. Requires `options`.
    - `RANKED_SELECT`: User ranks options. Requires `options` and optionally `maxRank`.
    - `RANGE_SLIDER`: User selects a value from a range. Requires `rangeMin`, `rangeMax`, and optionally `rangeStep`, `rangeDefault`.
- `order` (integer, required): Display order of the question.
- `options` (array of Option objects, optional): Required for `SINGLE_SELECT`, `MULTI_SELECT`, `RANKED_SELECT`.
- `maxRank` (integer, optional): For `RANKED_SELECT`, the maximum number of items to rank or the highest rank value.
- `rangeMin` (number, optional): For `RANGE_SLIDER`, minimum value.
- `rangeMax` (number, optional): For `RANGE_SLIDER`, maximum value.
- `rangeStep` (number, optional): For `RANGE_SLIDER`, increment step.
- `rangeDefault` (number, optional): For `RANGE_SLIDER`, default value.

#### Option Object (for `options` array)
- `label` (string, required): Display text for the option.
- `value` (string, required): Internal value for the option.
- `description` (string, optional): Additional information about the option.
- `order` (integer, optional): Display order of the option.

## 2. Quiz Definition (Response)

Example of a quiz definition as returned by `GET /api/quizzes/:id` or on successful `POST /api/quizzes`.

### Response Payload Example

```json
{
    "id": 1,
    "title": "Vaporizer Style Quiz",
    "description": "Find your perfect vaporizer style.",
    "createdAt": "2025-06-14T18:02:16.575Z",
    "updatedAt": "2025-06-14T18:02:16.575Z",
    "questions": [
        {
            "id": 1,
            "quizId": 1,
            "text": "What's your level of cannabis experience?",
            "subtitle": null,
            "type": "SINGLE_SELECT",
            "order": 1,
            "maxRank": null,
            "rangeMin": null,
            "rangeMax": null,
            "rangeStep": null,
            "rangeDefault": null,
            "createdAt": "2025-06-14T18:02:16.575Z",
            "updatedAt": "2025-06-14T18:02:16.575Z",
            "options": [
                {
                    "id": 1,
                    "questionId": 1,
                    "label": "Novice",
                    "value": "novice",
                    "description": null,
                    "order": 1,
                    "createdAt": "2025-06-14T18:02:16.575Z",
                    "updatedAt": "2025-06-14T18:02:16.575Z"
                },
                {
                    "id": 2,
                    "questionId": 1,
                    "label": "Experienced",
                    "value": "experienced",
                    "description": null,
                    "order": 2,
                    "createdAt": "2025-06-14T18:02:16.575Z",
                    "updatedAt": "2025-06-14T18:02:16.575Z"
                },
                {
                    "id": 3,
                    "questionId": 1,
                    "label": "Expert",
                    "value": "expert",
                    "description": null,
                    "order": 3,
                    "createdAt": "2025-06-14T18:02:16.575Z",
                    "updatedAt": "2025-06-14T18:02:16.575Z"
                }
            ]
        },
        {
            "id": 2,
            "quizId": 1,
            "text": "What's your primary use for a vaporizer?",
            "subtitle": null,
            "type": "SINGLE_SELECT",
            "order": 2,
            "maxRank": null,
            "rangeMin": null,
            "rangeMax": null,
            "rangeStep": null,
            "rangeDefault": null,
            "createdAt": "2025-06-14T18:02:16.575Z",
            "updatedAt": "2025-06-14T18:02:16.575Z",
            "options": [
                {
                    "id": 4,
                    "questionId": 2,
                    "label": "Medical",
                    "value": "medical",
                    "description": null,
                    "order": 1,
                    "createdAt": "2025-06-14T18:02:16.575Z",
                    "updatedAt": "2025-06-14T18:02:16.575Z"
                },
                {
                    "id": 5,
                    "questionId": 2,
                    "label": "Recreational",
                    "value": "recreational",
                    "description": null,
                    "order": 2,
                    "createdAt": "2025-06-14T18:02:16.575Z",
                    "updatedAt": "2025-06-14T18:02:16.575Z"
                },
                {
                    "id": 6,
                    "questionId": 2,
                    "label": "Both",
                    "value": "both",
                    "description": null,
                    "order": 3,
                    "createdAt": "2025-06-14T18:02:16.575Z",
                    "updatedAt": "2025-06-14T18:02:16.575Z"
                }
            ]
        },
        {
            "id": 3,
            "quizId": 1,
            "text": "How often do you use cannabis?",
            "subtitle": null,
            "type": "SINGLE_SELECT",
            "order": 3,
            "maxRank": null,
            "rangeMin": null,
            "rangeMax": null,
            "rangeStep": null,
            "rangeDefault": null,
            "createdAt": "2025-06-14T18:02:16.575Z",
            "updatedAt": "2025-06-14T18:02:16.575Z",
            "options": [
                {
                    "id": 7,
                    "questionId": 3,
                    "label": "Occasionally",
                    "value": "occasional",
                    "description": null,
                    "order": 1,
                    "createdAt": "2025-06-14T18:02:16.575Z",
                    "updatedAt": "2025-06-14T18:02:16.575Z"
                },
                {
                    "id": 8,
                    "questionId": 3,
                    "label": "Weekly",
                    "value": "weekly",
                    "description": null,
                    "order": 2,
                    "createdAt": "2025-06-14T18:02:16.575Z",
                    "updatedAt": "2025-06-14T18:02:16.575Z"
                },
                {
                    "id": 9,
                    "questionId": 3,
                    "label": "Daily",
                    "value": "daily",
                    "description": null,
                    "order": 3,
                    "createdAt": "2025-06-14T18:02:16.575Z",
                    "updatedAt": "2025-06-14T18:02:16.575Z"
                }
            ]
        },
        {
            "id": 4,
            "quizId": 1,
            "text": "How portable should your vaporizer be?",
            "subtitle": null,
            "type": "SINGLE_SELECT",
            "order": 4,
            "maxRank": null,
            "rangeMin": null,
            "rangeMax": null,
            "rangeStep": null,
            "rangeDefault": null,
            "createdAt": "2025-06-14T18:02:16.575Z",
            "updatedAt": "2025-06-14T18:02:16.575Z",
            "options": [
                {
                    "id": 10,
                    "questionId": 4,
                    "label": "Desktop/Home Use",
                    "value": "desktop",
                    "description": null,
                    "order": 1,
                    "createdAt": "2025-06-14T18:02:16.575Z",
                    "updatedAt": "2025-06-14T18:02:16.575Z"
                },
                {
                    "id": 11,
                    "questionId": 4,
                    "label": "Portable",
                    "value": "portable",
                    "description": null,
                    "order": 2,
                    "createdAt": "2025-06-14T18:02:16.575Z",
                    "updatedAt": "2025-06-14T18:02:16.575Z"
                }
            ]
        },
        {
            "id": 5,
            "quizId": 1,
            "text": "What's your budget?",
            "subtitle": null,
            "type": "SINGLE_SELECT",
            "order": 5,
            "maxRank": null,
            "rangeMin": null,
            "rangeMax": null,
            "rangeStep": null,
            "rangeDefault": null,
            "createdAt": "2025-06-14T18:02:16.575Z",
            "updatedAt": "2025-06-14T18:02:16.575Z",
            "options": []
        },
        {
            "id": 6,
            "quizId": 1,
            "text": "Rate your vaporizer priorities (1 = least important, 5 = most important)",
            "subtitle": null,
            "type": "SINGLE_SELECT",
            "order": 6,
            "maxRank": null,
            "rangeMin": null,
            "rangeMax": null,
            "rangeStep": null,
            "rangeDefault": null,
            "createdAt": "2025-06-14T18:02:16.575Z",
            "updatedAt": "2025-06-14T18:02:16.575Z",
            "options": []
        }
    ]
}
```

### Response Field Descriptions

Includes all fields from the request, plus database-generated fields:

#### Root Object
- `id` (integer): Unique quiz ID.
- `createdAt`, `updatedAt` (ISO 8601 datetime string).

#### Question Object (in response)
- `id` (integer): Unique question ID.
- `quizId` (integer): Foreign key to quiz.
- `createdAt`, `updatedAt` (ISO 8601 datetime string).

#### Option Object (in response)
- `id` (integer): Unique option ID.
- `questionId` (integer): Foreign key to question.
- `createdAt`, `updatedAt` (ISO 8601 datetime string).

## 3. User Preferences Payload (for Recommendations)

This payload is used to submit user preferences to get product recommendations.

**Endpoint:** `POST /api/quizzes/recommendations`
**Content-Type:** `application/json`

### Request Payload Example

```json
{
  "metadata": {
    "userId": "user_abc123xyz",
    "submissionVersion": "prefs-v1.1",
    "clientTimestamp": "2025-06-14T21:30:00Z"
  },
  "preferences": {
    "cannabisExperience": "novice",
    "primaryUse": "medical",
    "simplicityPreference": "high",
    "discretionImportance": "medium",
    "heatingMethod": "hybrid",
    "airflowPreference": "restricted",
    "temperatureControl": "precise",
    "usagePattern": "daily",
    "userType": "casual",
    "portability": "portable",
    "budget": 250,
    "priorities": {
      "vaporPotency": 8,
      "vaporComfort": 7,
      "portability": 9,
      "batteryLife": 6,
      "buildQuality": 7,
      "easeOfUse": 8,
      "maintenance": 5,
      "value": 7
    }
  }
}
```

### Request Field Descriptions

#### Root Object
- `metadata` (object, required): Contains metadata about the submission.
  - `userId` (string, required): Unique identifier for the user.
  - `submissionVersion` (string, optional): Version of the preferences submission or questionnaire.
  - `clientTimestamp` (ISO 8601 datetime string, optional): Timestamp from the client when preferences were submitted.
- `preferences` (object, required): Contains the user's actual preferences.
  - `cannabisExperience` (string, optional, nullable)
  - `primaryUse` (string, optional, nullable)
  - `simplicityPreference` (string, optional, nullable)
  - `discretionImportance` (string, optional, nullable)
  - `heatingMethod` (string, optional, nullable)
  - `airflowPreference` (string, optional, nullable)
  - `temperatureControl` (string, optional, nullable)
  - `usagePattern` (string, optional, nullable)
  - `userType` (string, optional, nullable)
  - `portability` (string, optional, nullable)
  - `budget` (integer, optional, nullable, positive)
  - `priorities` (object, optional, nullable): Contains key-value pairs for different priority ratings.
    - `vaporPotency` (integer, optional, nullable, 1-10)
    - `vaporComfort` (integer, optional, nullable, 1-10)
    - `portability` (integer, optional, nullable, 1-10)
    - `batteryLife` (integer, optional, nullable, 1-10)
    - `buildQuality` (integer, optional, nullable, 1-10)
    -  `easeOfUse` (integer, optional, nullable, 1-10)
    - `maintenance` (integer, optional, nullable, 1-10)
    - `value` (integer, optional, nullable, 1-10)

---

## 4. Submit Quiz Attempt

This payload is used to submit a user's answers for a specific quiz.

**Endpoint:** `POST /api/quizzes/attempts`
**Content-Type:** `application/json`

### Request Payload Example

Based on the Zod schema `SubmitQuizAttemptSchema` in `quiz.service.ts`.

```json
{
  "quizId": 1,
  "userId": "user_abc123xyz",
  "answers": [
    {
      "questionId": 1,
      "type": "SINGLE_SELECT",
      "selectedOptionValue": "experienced"
    },
    {
      "questionId": 2,
      "type": "SINGLE_SELECT",
      "selectedOptionValue": "recreational"
    },
    {
      "questionId": 4,
      "type": "SINGLE_SELECT",
      "selectedOptionValue": "portable"
    },
    {
      "questionId": 5,
      "type": "RANGE_SLIDER",
      "rangeValue": 250
    },
    {
      "questionId": 6,
      "type": "RANKED_SELECT",
      "rankedOptions": [
        { "optionValue": "vaporPotency", "rank": 1 },
        { "optionValue": "portability", "rank": 2 },
        { "optionValue": "easeOfUse", "rank": 3 },
        { "optionValue": "buildQuality", "rank": 4 },
        { "optionValue": "vaporComfort", "rank": 5 },
        { "optionValue": "value", "rank": 6 },
        { "optionValue": "batteryLife", "rank": 7 },
        { "optionValue": "maintenance", "rank": 8 }
      ]
    }
  ]
}
```

### Request Field Descriptions

#### Root Object
- `quizId` (integer, required): The ID of the quiz being attempted.
- `userId` (string, required): The ID of the user submitting the answers.
- `answers` (array of Answer objects, required, min 1 item): The list of answers.

#### Answer Object (`answers` array item)
- `questionId` (integer, required): The ID of the question being answered.
- `type` (enum string, required): The type of question, must match the question in the database.
- `selectedOptionValue` (string, optional): The `value` of the selected option for `SINGLE_SELECT` questions.
- `selectedOptionValues` (array of strings, optional): An array of `value`s for `MULTI_SELECT` questions.
- `rankedOptions` (array of objects, optional): For `RANKED_SELECT`, an array of `{ "optionValue": string, "rank": integer }` objects.
- `rangeValue` (number, optional): The selected number for `RANGE_SLIDER` questions.

### Response Payload Example

On success, the endpoint returns the created `UserQuizAttempt` object along with a `primaryRecommendationId`, with a `201` status code.

```json
{
    "id": 1,
    "userId": "user_abc123xyz",
    "quizId": 1,
    "rawAnswersJson": [
        {
            "type": "SINGLE_SELECT",
            "questionId": 1,
            "selectedOptionValue": "experienced"
        }
    ],
    "completedAt": "2025-06-16T18:05:00.000Z",
    "createdAt": "2025-06-16T18:05:00.000Z",
    "updatedAt": "2025-06-16T18:05:00.000Z",
    "answers": [
        {
            "id": 1,
            "userQuizAttemptId": 1,
            "questionId": 1,
            "selectedOptionId": 2,
            "selectedOptionValues": [],
            "rankedAnswersJson": null,
            "rangeValue": null,
            "createdAt": "2025-06-16T18:05:00.000Z",
            "updatedAt": "2025-06-16T18:05:00.000Z",
            "question": {
                "id": 1,
                "text": "What's your level of cannabis experience?",
                "subtitle": null,
                "type": "SINGLE_SELECT",
                "order": 1,
                "maxRank": null,
                "rangeMin": null,
                "rangeMax": null,
                "rangeStep": null,
                "rangeDefault": null,
                "createdAt": "2025-06-16T18:05:00.000Z",
                "updatedAt": "2025-06-16T18:05:00.000Z"
            },
            "selectedOption": {
                "id": 2,
                "questionId": 1,
                "label": "Experienced",
                "value": "experienced",
                "description": null,
                "order": 2,
                "createdAt": "2025-06-16T18:05:00.000Z",
                "updatedAt": "2025-06-16T18:05:00.000Z"
            }
        }
    ],
    "primaryRecommendationId": "venty"
}
```

---
