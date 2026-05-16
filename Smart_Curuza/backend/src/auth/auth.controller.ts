/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  UseInterceptors,
  UploadedFiles,
  Param,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePinDto } from './dto/change-pin.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'registration_doc', maxCount: 1 },
        { name: 'owner_id_doc', maxCount: 1 },
      ],
      {
        storage: process.env.VERCEL
          ? memoryStorage()
          : diskStorage({
              destination: './uploads',
              filename: (req, file, cb) => {
                const randomName = Array(32)
                  .fill(null)
                  .map(() => Math.round(Math.random() * 16).toString(16))
                  .join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
              },
            }),
      },
    ),
  )
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFiles()
    files: {
      registration_doc?: Express.Multer.File[];
      owner_id_doc?: Express.Multer.File[];
    },
  ) {
    return this.authService.register(registerDto, files);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-pin')
  async changePin(@Request() req, @Body() changePinDto: ChangePinDto) {
    return this.authService.changePin(
      req.user.userId,
      changePinDto.oldPin,
      changePinDto.newPin,
    );
  }

  @Get('login/status/:id')
  async getLoginStatus(@Param('id') id: string) {
    return this.authService.checkLoginStatus(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.MERCHANT, UserRole.SUPERADMIN)
  @Post('login/approve/:id')
  async approveLogin(@Request() req, @Param('id') id: string) {
    return this.authService.approveLogin(id, req.user.merchantId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.MERCHANT, UserRole.SUPERADMIN)
  @Post('login/reject/:id')
  async rejectLogin(@Request() req, @Param('id') id: string) {
    return this.authService.rejectLogin(id, req.user.merchantId);
  }

  @Post('login/override/:id')
  async overrideLogin(@Param('id') id: string, @Body('pin') pin: string) {
    return this.authService.overrideLogin(id, pin);
  }
}
