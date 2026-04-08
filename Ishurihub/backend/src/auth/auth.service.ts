import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user || !user.password) {
      return null;
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);

    if (isPasswordMatching) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      roleId: user.roleId,
      schoolId: user.schoolId,
      features: user.school?.features || [],
      plan: user.school?.plan || 'Free',
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        customRole: user.customRole,
        schoolId: user.schoolId,
        avatarUrl: user.avatarUrl,
        school: user.school,
      },
    };
  }
}
