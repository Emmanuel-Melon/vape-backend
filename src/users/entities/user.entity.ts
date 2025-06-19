import { User as PrismaUser, UserRole } from '@prisma/client';

// This type can be used in your services and controllers for type safety.
// It mirrors the Prisma User model.
export type User = PrismaUser;

// You can also export UserRole if you need to reference it elsewhere
export { UserRole };
