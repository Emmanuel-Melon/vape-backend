import {
  Controller,
  Post,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  UseGuards,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService, RegisterInput } from './auth.service';

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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = this.authService.generateJwt(req.user);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'none', // Or 'strict'
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    return { message: 'Logged in successfully' };
  }
}
