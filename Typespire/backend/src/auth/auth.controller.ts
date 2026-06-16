import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
  Sse,
  MessageEvent,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService, UserWithInstitution } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    return this.authService.login(req.user as UserWithInstitution);
  }

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      institutionId?: string;
    },
  ) {
    return this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user as User;
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/progress')
  async updateProgress(@Request() req: any, @Body() progress: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.updatePracticeProgress(req.user.id, progress);
  }

  @Get('sso')
  async ssoLogin(@Query('token') token: string) {
    return this.authService.validateSsoToken(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.generatePasswordResetToken(body.email);
    return {
      message: 'If that email exists, a password reset link has been sent.',
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    await this.authService.resetPassword(body.token, body.newPassword);
    return { message: 'Password has been successfully reset.' };
  }

  @Sse('sse')
  sse(@Query('token') token: string): Observable<MessageEvent> {
    if (!token) {
      throw new UnauthorizedException('Token required');
    }
    return this.authService.registerSseToken(token);
  }

  @Post('report-compromise')
  async reportCompromise(@Body() body: { token: string }) {
    if (!body.token) {
      throw new UnauthorizedException('Token required');
    }
    return this.authService.reportCompromise(body.token);
  }
}
