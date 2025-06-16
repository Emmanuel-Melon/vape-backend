import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { jwtSecret } from '../config';

// A custom extractor to get the JWT from the httpOnly cookie
const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not set in environment variables');
    }
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: string; username: string }) {
    // The payload is the decoded JWT. We use the 'sub' (subject) claim, which is the user ID.
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      // This would mean the user associated with the token no longer exists.
      throw new UnauthorizedException('User not found');
    }

    // NestJS will attach this user object to the request (e.g., req.user)
    return user;
  }
}
