import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'secretKey',
    });
  }

  async validate(payload: { sub: string; email: string; role: string; sessionId?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { institution: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Concurrent login check: limit only one active login session per user
    if (user.currentSessionId && (!payload.sessionId || payload.sessionId !== user.currentSessionId)) {
      throw new UnauthorizedException('Session expired. Logged in from another device.');
    }

    if (user.role !== 'PLATFORM_ADMIN' && user.institution) {
      const { subscriptionStatus, subscriptionEndDate } = user.institution;

      if (subscriptionStatus === 'SUSPENDED') {
        throw new ForbiddenException(
          "Your institution's account has been suspended. Please contact support.",
        );
      }

      if (subscriptionStatus === 'EXPIRED') {
        throw new ForbiddenException(
          "Your institution's subscription has expired and the grace period has ended. Please contact support.",
        );
      }

      if (subscriptionEndDate) {
        const endDateMs = new Date(subscriptionEndDate).getTime();
        const gracePeriodMs = 10 * 24 * 60 * 60 * 1000; // 10 days grace period
        if (Date.now() > endDateMs + gracePeriodMs) {
          throw new ForbiddenException(
            "Your institution's subscription has expired and the grace period has ended. Please contact support.",
          );
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
