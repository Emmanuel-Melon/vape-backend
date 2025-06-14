"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.MagicLinkEmailSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const common_1 = require("@nestjs/common");
const supabase_1 = require("../lib/supabase");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const z = require("zod");
exports.RegisterSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }).max(30, { message: "Username must be no more than 30 characters long" }),
    role: z.nativeEnum(client_1.UserRole).optional(),
});
exports.LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});
exports.MagicLinkEmailSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(data) {
        const { email, password, username, role = client_1.UserRole.USER } = data;
        try {
            const { data: existingAuthTest } = await supabase_1.supabase.auth.signInWithPassword({
                email,
                password: 'a-deliberately-incorrect-and-long-dummy-password-to-check-email-existence'
            });
            if (existingAuthTest?.user && !existingAuthTest.session) {
                throw new Error('ACCOUNT_EXISTS');
            }
            const existingPrismaUser = await this.prisma.user.findUnique({
                where: { username }
            });
            if (existingPrismaUser) {
                throw new Error('USERNAME_TAKEN');
            }
            const { data: authData, error: authError } = await supabase_1.supabase.auth.signUp({
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
                    role,
                    updatedAt: new Date()
                }
            });
            return {
                user,
                session: authData.session
            };
        }
        catch (error) {
            if (error instanceof Error) {
                switch (error.message) {
                    case 'ACCOUNT_EXISTS':
                        throw new Error('An account with this email already exists.');
                    case 'USERNAME_TAKEN':
                        throw new Error('This username is already taken.');
                    default:
                        console.error('Unhandled registration error:', error);
                        throw new Error(`Registration failed: ${error.message}`);
                }
            }
            throw error;
        }
    }
    async login(data) {
        const { email, password } = data;
        try {
            const { data: authData, error: authError } = await supabase_1.supabase.auth.signInWithPassword({
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
                console.error(`User ${authData.user.id} found in Supabase but not in Prisma.`);
                throw new Error('USER_NOT_FOUND_IN_DB');
            }
            return {
                user,
                session: authData.session
            };
        }
        catch (error) {
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
    async generateMagicLink(data) {
        const { email } = data;
        try {
            const { error } = await supabase_1.supabase.auth.signInWithOtp({
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
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Failed to send magic link:', error);
                throw new Error(`Failed to send magic link: ${error.message}`);
            }
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map