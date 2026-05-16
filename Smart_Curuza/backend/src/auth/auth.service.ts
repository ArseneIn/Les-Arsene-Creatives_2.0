import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

import { Merchant } from '../entities/merchant.entity';
import {
  LoginRequest,
  LoginRequestStatus,
} from '../entities/login-request.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Merchant)
    private merchantsRepository: Repository<Merchant>,
    @InjectRepository(LoginRequest)
    private loginRequestsRepository: Repository<LoginRequest>,
    private jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
    files?: {
      registration_doc?: Express.Multer.File[];
      owner_id_doc?: Express.Multer.File[];
    },
  ): Promise<User> {
    const {
      email,
      password,
      phone,
      pin,
      role,
      business_name,
      name,
      address,
      tin,
    } = registerDto;

    if (email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email },
      });
      if (existingUser) throw new ConflictException('Email already exists');
    }
    if (phone) {
      const existingUser = await this.usersRepository.findOne({
        where: { phone },
      });
      if (existingUser)
        throw new ConflictException('Phone number already exists');
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const hashedPin = pin ? await bcrypt.hash(pin, 10) : undefined;

    const user = this.usersRepository.create({
      email,
      phone,
      name,
      password: hashedPassword,
      pin_hash: hashedPin,
      role: role || UserRole.USER,
    });

    const savedUser = await this.usersRepository.save(user);

    // Get file paths if they exist
    const registrationDocPath = files?.registration_doc?.[0]?.path;
    const ownerIdDocPath = files?.owner_id_doc?.[0]?.path;

    // Create default merchant for the user
    const merchant = this.merchantsRepository.create({
      business_name: business_name || 'Smart Curuza Shop',
      owner: savedUser,
      device_id: `DEV-${Date.now()}`, // Temporary device ID
      subscription_status: 'TRIAL',
      subscription_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
      phone: phone || '',
      address: address || 'Kigali, Rwanda',
      tin: tin || '000000000',
      registration_doc_url: registrationDocPath,
      owner_id_doc_url: ownerIdDocPath,
    });

    const savedMerchant = await this.merchantsRepository.save(merchant);

    // Link merchant to user
    savedUser.merchant = savedMerchant;
    return await this.usersRepository.save(savedUser);
  }

  async login(loginDto: LoginDto) {
    const { email, password, phone, pin } = loginDto;

    let user: User | null = null;
    if (email) {
      user = await this.usersRepository.findOne({
        where: { email },
        relations: ['merchant'],
      });
    } else if (phone) {
      user = await this.usersRepository.findOne({
        where: { phone },
        relations: ['merchant'],
      });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let isValid = false;
    if (password && user.password) {
      isValid = await bcrypt.compare(password, user.password);
    } else if (pin && user.pin_hash) {
      isValid = await bcrypt.compare(pin, user.pin_hash);
    }

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role === UserRole.CASHIER) {
      // Create a login request instead of returning token immediately
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      const loginRequest = this.loginRequestsRepository.create({
        cashierId: user.id,
        merchantId: user.merchant.id,
        status: LoginRequestStatus.PENDING,
        expires_at: expiresAt,
      });
      const savedRequest =
        await this.loginRequestsRepository.save(loginRequest);

      return {
        status: 'REQUIRES_APPROVAL',
        loginRequestId: savedRequest.id,
        message: 'Waiting for merchant approval.',
        expiresAt,
      };
    }

    return this.generateAuthResponse(user);
  }

  private generateAuthResponse(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      merchantId: user.merchant?.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        merchantId: user.merchant?.id,
        shopName: user.merchant?.business_name,
      },
    };
  }

  async checkLoginStatus(requestId: string) {
    const request = await this.loginRequestsRepository.findOne({
      where: { id: requestId },
      relations: ['cashier', 'cashier.merchant'],
    });

    if (!request) throw new UnauthorizedException('Login request not found');

    if (
      new Date() > request.expires_at &&
      request.status === LoginRequestStatus.PENDING
    ) {
      request.status = LoginRequestStatus.EXPIRED;
      await this.loginRequestsRepository.save(request);
    }

    if (request.status === LoginRequestStatus.APPROVED) {
      return this.generateAuthResponse(request.cashier);
    } else if (request.status === LoginRequestStatus.REJECTED) {
      throw new UnauthorizedException('Login request rejected by merchant');
    } else if (request.status === LoginRequestStatus.EXPIRED) {
      throw new UnauthorizedException('Login request expired');
    }

    return { status: 'PENDING' };
  }

  async approveLogin(requestId: string, merchantId: string) {
    const request = await this.loginRequestsRepository.findOne({
      where: { id: requestId, merchantId },
    });
    if (!request) throw new UnauthorizedException('Login request not found');

    request.status = LoginRequestStatus.APPROVED;
    await this.loginRequestsRepository.save(request);
    return { success: true };
  }

  async rejectLogin(requestId: string, merchantId: string) {
    const request = await this.loginRequestsRepository.findOne({
      where: { id: requestId, merchantId },
    });
    if (!request) throw new UnauthorizedException('Login request not found');

    request.status = LoginRequestStatus.REJECTED;
    await this.loginRequestsRepository.save(request);
    return { success: true };
  }

  async overrideLogin(requestId: string, pin: string) {
    const request = await this.loginRequestsRepository.findOne({
      where: { id: requestId },
      relations: ['merchant', 'merchant.owner', 'cashier', 'cashier.merchant'],
    });

    if (!request) throw new UnauthorizedException('Login request not found');

    if (
      new Date() > request.expires_at &&
      request.status === LoginRequestStatus.PENDING
    ) {
      request.status = LoginRequestStatus.EXPIRED;
      await this.loginRequestsRepository.save(request);
      throw new UnauthorizedException('Login request expired');
    }

    const owner = request.merchant.owner;
    if (!owner || !owner.pin_hash) {
      throw new UnauthorizedException('Owner PIN not set');
    }

    const isValid = await bcrypt.compare(pin, owner.pin_hash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid override PIN');
    }

    request.status = LoginRequestStatus.APPROVED;
    await this.loginRequestsRepository.save(request);

    return this.generateAuthResponse(request.cashier);
  }

  async changePin(userId: string, oldPin: string, newPin: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || (!user.pin_hash && !oldPin)) {
      throw new UnauthorizedException('User not found or no PIN set');
    }

    // Verify old PIN
    if (user.pin_hash) {
      if (!oldPin) {
        throw new UnauthorizedException('Old PIN is required');
      }
      const isValid = await bcrypt.compare(oldPin, user.pin_hash);
      if (!isValid) {
        throw new UnauthorizedException('Incorrect old PIN');
      }
    }

    // Update to new PIN
    user.pin_hash = await bcrypt.hash(newPin, 10);
    await this.usersRepository.save(user);

    return { success: true, message: 'PIN updated successfully' };
  }
}
