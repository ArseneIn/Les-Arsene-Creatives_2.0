import {
  Injectable,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';
import { MailerService } from '../mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserRole, User, Institution } from '@prisma/client';

export type UserWithInstitution = User & {
  institution?: Institution | null;
};

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
    private mailerService: MailerService,
  ) {}

  async validateUser(
    emailOrUsername: string,
    pass: string,
    institutionSlug?: string,
  ): Promise<Omit<User, 'password'> | null> {
    let user: UserWithInstitution | null = null;

    if (emailOrUsername.includes('@')) {
      user = await this.prisma.user.findFirst({
        where: {
          email: {
            equals: emailOrUsername,
            mode: 'insensitive',
          },
        },
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
          username: {
            equals: emailOrUsername,
            mode: 'insensitive',
          },
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

  async login(user: UserWithInstitution) {
    const sessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

    // Save new sessionId to database
    await this.prisma.user.update({
      where: { id: user.id },
      data: { currentSessionId: sessionId },
    });

    const payload = { email: user.email, sub: user.id, role: user.role, sessionId };
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
        metadata: { role: user.role, sessionId },
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
        practiceProgress: user.practiceProgress,
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

  async updatePracticeProgress(userId: string, progress: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        practiceProgress: progress,
      },
      select: {
        id: true,
        practiceProgress: true,
      },
    });
  }

  async generatePasswordResetToken(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (!user || !user.email) {
      // Silently return to prevent email enumeration
      return;
    }

    const unhashedToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(unhashedToken).digest('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expires,
      },
    });

    await this.mailerService.sendPasswordResetEmail(user.email, unhashedToken);
  }

  async resetPassword(unhashedToken: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(unhashedToken).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new ForbiddenException('Token is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }
}
