import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey', // Fallback for dev
    });
  }

  validate(payload: {
    sub: string;
    email: string;
    roleId: string;
    schoolId?: string;
  }) {
    return {
      userId: payload.sub,
      email: payload.email,
      roleId: payload.roleId,
      schoolId: payload.schoolId,
    };
  }
}
