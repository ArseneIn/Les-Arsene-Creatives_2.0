import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService, UserWithInstitution } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '@prisma/client';

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
  async updateProgress(
    @Request() req: any,
    @Body() progress: any,
  ) {
    return this.authService.updatePracticeProgress(req.user.id, progress);
  }

  @Get('sso')
  async ssoLogin(@Query('token') token: string) {
    return this.authService.validateSsoToken(token);
  }
}
