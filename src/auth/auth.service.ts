import { Injectable } from '@nestjs/common';
import { supabase } from '../lib/supabase';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as z from 'zod';

// Zod Schemas
export const RegisterSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }).max(30, { message: "Username must be no more than 30 characters long" }),
    role: z.nativeEnum(UserRole).optional(),
});

export const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const MagicLinkEmailSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

// Inferred Types
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type MagicLinkEmailInput = z.infer<typeof MagicLinkEmailSchema>;


export interface MagicLinkResponse { // This is an output, so it can remain an interface
    message: string;
}

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async register(data: RegisterInput) {
        const { email, password, username, role = UserRole.USER } = data;
        try {
            // Supabase's signUp will fail if the email is already registered.
            // The dummy password check might be less reliable or lead to confusing error paths.
            // Consider relying on signUp's error for existing accounts.
            const { data: existingAuthTest } = await supabase.auth.signInWithPassword({
                email,
                password: 'a-deliberately-incorrect-and-long-dummy-password-to-check-email-existence'
            });

            if (existingAuthTest?.user && !existingAuthTest.session) { // User exists if we get a user object without a session (due to wrong password)
                throw new Error('ACCOUNT_EXISTS');
            }

            const existingPrismaUser = await this.prisma.user.findUnique({
                where: { username }
            });

            if (existingPrismaUser) {
                throw new Error('USERNAME_TAKEN');
            }

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) {
                if (authError.message.includes('User already registered')) {
                    throw new Error('ACCOUNT_EXISTS');
                }
                throw authError;
            }
            if (!authData.user) {
                throw new Error('User registration failed: No user data returned.');
            }

            const user = await this.prisma.user.create({
                data: {
                    id: authData.user.id,
                    email,
                    username,
                    // Do NOT store the password here. Supabase handles authentication.
                    role,
                    updatedAt: new Date()
                }
            });

            return {
                user,
                session: authData.session
            };
        } catch (error) {
            if (error instanceof Error) {
                switch (error.message) {
                    case 'ACCOUNT_EXISTS':
                        throw new Error('An account with this email already exists.');
                    case 'USERNAME_TAKEN':
                        throw new Error('This username is already taken.');
                    default:
                        // Log the original error for debugging if it's not one of the caught ones
                        console.error('Unhandled registration error:', error);
                        throw new Error(`Registration failed: ${error.message}`);
                }
            }
            throw error;
        }
    }

    async login(data: LoginInput) {
        const { email, password } = data;
        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                if (authError.message === 'Invalid login credentials') {
                    throw new Error('INVALID_CREDENTIALS');
                }
                throw authError; 
            }

            if (!authData.user) {
                throw new Error('LOGIN_FAILED');
            }

            const user = await this.prisma.user.findUnique({
                where: {
                    id: authData.user.id
                }
            });

            if (!user) {
                // This implies user exists in Supabase Auth but not in Prisma DB.
                // This is a potential data inconsistency issue.
                console.error(`User ${authData.user.id} found in Supabase but not in Prisma.`);
                throw new Error('USER_NOT_FOUND_IN_DB');
            }

            return {
                user,
                session: authData.session
            };
        } catch (error) {
            if (error instanceof Error) {
                switch (error.message) {
                    case 'INVALID_CREDENTIALS':
                        throw new Error('Invalid email or password.');
                    case 'USER_NOT_FOUND_IN_DB':
                        throw new Error('User account not found in our system. Please contact support.');
                    case 'LOGIN_FAILED':
                        throw new Error('Login failed. Please try again.');
                    default:
                        console.error('Unhandled login error:', error);
                        throw new Error(`Login failed: ${error.message}`);
                }
            }
            throw error;
        }
    }

    async generateMagicLink(data: MagicLinkEmailInput): Promise<MagicLinkResponse> {
        const { email } = data;
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true 
                }
            });

            if (error) {
                throw error;
            }

            return {
                message: 'Magic link sent. Check your email.'
            };
        } catch (error) {
            if (error instanceof Error) {
                console.error('Failed to send magic link:', error);
                throw new Error(`Failed to send magic link: ${error.message}`);
            }
            throw error;
        }
    }
}