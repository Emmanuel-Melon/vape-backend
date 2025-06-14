import { AuthService, RegisterInput, LoginInput } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerInput: RegisterInput): Promise<{
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
    login(loginInput: LoginInput): Promise<{
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
}
