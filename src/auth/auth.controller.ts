import { Body, Controller, Post, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService, RegisterInput, LoginInput, MagicLinkResponse } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() registerInput: RegisterInput) {
        try {
            return await this.authService.register(registerInput);
        } catch (error) {
            if (error instanceof Error) {
                switch (error.message) {
                    case 'An account with this email already exists.':
                        throw new ConflictException(error.message);
                    case 'This username is already taken.':
                        throw new ConflictException(error.message);
                    default:
                        throw new BadRequestException(error.message);
                }
            }
            throw error;
        }
    }

    @Post('login')
    async login(@Body() loginInput: LoginInput) {
        try {
            return await this.authService.login(loginInput);
        } catch (error) {
            if (error instanceof Error) {
                switch (error.message) {
                    case 'Invalid email or password.':
                        throw new UnauthorizedException(error.message);
                    case 'User account not found in the system.':
                        throw new UnauthorizedException(error.message);
                    case 'Login failed. Please try again.':
                        throw new UnauthorizedException(error.message);
                    default:
                        throw new BadRequestException(error.message);
                }
            }
            throw error;
        }
    }

}