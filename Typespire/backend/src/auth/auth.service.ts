import {
  Injectable,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';
import * as bcrypt from 'bcrypt';
import { UserRole, User } from '@prisma/client';

interface SsoPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  institutionId?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private logsService: LogsService,
  ) {}

  async validateUser(
    emailOrUsername: string,
    pass: string,
    institutionSlug?: string,
  ): Promise<Omit<User, 'password'> | null> {
    let user: any = null;

    if (emailOrUsername.includes('@')) {
      user = await this.prisma.user.findUnique({
        where: { email: emailOrUsername },
        include: { institution: true },
      });
    } else {
      if (!institutionSlug) {
        return null; // Username login requires an institution
      }
      const institution = await this.prisma.institution.findUnique({
        where: { slug: institutionSlug },
      });
      if (!institution) {
        return null;
      }
      user = await this.prisma.user.findFirst({
        where: {
          username: emailOrUsername,
          institutionId: institution.id,
        },
        include: { institution: true },
      });
    }

    if (user && (await bcrypt.compare(pass, user.password))) {
      // If institution slug is provided, verify user belongs to it
      if (institutionSlug) {
        if (user.role !== UserRole.PLATFORM_ADMIN) {
          const institution = await this.prisma.institution.findUnique({
            where: { slug: institutionSlug },
          });

          if (!institution || user.institutionId !== institution.id) {
            return null; // User does not belong to the selected institution
          }
        }
      }

      // Check for expired/suspended plan
      if (user.role !== UserRole.PLATFORM_ADMIN && user.institution) {
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
    return null;
  }

  login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    // Fire-and-forget: log the login event
    this.logsService
      .log({
        action: 'USER_LOGIN',
        category: 'AUTH',
        actorId: user.id,
        actorName:
          `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
          user.email ||
          'User',
        severity: 'INFO',
        metadata: { role: user.role },
      })
      .catch(() => {});

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        institutionId: user.institutionId,
        sectionId: user.sectionId,
        institution: user.institution,
      },
    };
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    institutionId?: string;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || UserRole.STUDENT,
      },
    });

    // Log registration event
    this.logsService
      .log({
        action: 'USER_REGISTERED',
        category: 'AUTH',
        actorId: user.id,
        actorName:
          `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
          user.email ||
          'User',
        severity: 'INFO',
        metadata: { role: user.role, email: user.email },
      })
      .catch(() => {});

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async validateSsoToken(token: string) {
    try {
      const ssoSecret = this.configService.get<string>('SSO_SECRET');
      if (!ssoSecret) {
        throw new Error('SSO_SECRET not configured');
      }

      const payload = await this.jwtService.verifyAsync<SsoPayload>(token, {
        secret: ssoSecret,
      });

      // Payload expected: { email, firstName, lastName, role?, institutionId?, courseId? }
      const { email, firstName, lastName, role, institutionId } = payload;

      if (!email) {
        throw new Error('Invalid SSO token: email missing');
      }

      // Find or Create User
      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Create new user
        // Default password for SSO users (they won't use it anyway, but DB needs it)
        const hashedPassword = await bcrypt.hash(
          Math.random().toString(36).slice(-8),
          10,
        );

        user = await this.prisma.user.create({
          data: {
            email,
            firstName: firstName || 'SSO',
            lastName: lastName || 'User',
            role: role || UserRole.STUDENT,
            institutionId: institutionId || null,
            password: hashedPassword,
          },
        });
      }

      // Generate Session Token
      return this.login(user);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new ConflictException('Invalid SSO Token: ' + errorMessage);
    }
  }
}
