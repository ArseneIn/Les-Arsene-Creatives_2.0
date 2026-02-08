import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, pass: string): Promise<any> {
    const institutionSlug = req.body?.institution;
    const user = await this.authService.validateUser(
      email,
      pass,
      institutionSlug,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
