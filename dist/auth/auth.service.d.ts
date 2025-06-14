import { PrismaService } from '../prisma/prisma.service';
import * as z from 'zod';
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    username: z.ZodString;
    role: z.ZodOptional<z.ZodNativeEnum<{
        USER: "USER";
        ADMIN: "ADMIN";
    }>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    username: string;
    role?: "USER" | "ADMIN" | undefined;
}, {
    email: string;
    password: string;
    username: string;
    role?: "USER" | "ADMIN" | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const MagicLinkEmailSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type MagicLinkEmailInput = z.infer<typeof MagicLinkEmailSchema>;
export interface MagicLinkResponse {
    message: string;
}
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    register(data: RegisterInput): Promise<{
        user: {
            email: string;
            password: string | null;
            username: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        session: import("@supabase/auth-js").Session | null;
    }>;
    login(data: LoginInput): Promise<{
        user: {
            email: string;
            password: string | null;
            username: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        session: import("@supabase/auth-js").Session;
    }>;
    generateMagicLink(data: MagicLinkEmailInput): Promise<MagicLinkResponse>;
}
