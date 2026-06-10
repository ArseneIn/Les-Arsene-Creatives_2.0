import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { StudentsService } from '../students/students.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private studentsService: StudentsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Record<string, unknown> | null> {
    const user = await this.usersService.findOne(email);
    if (!user || !user.password) {
      return null;
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);

    if (isPasswordMatching) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as Record<string, unknown>;
    }
    return null;
  }

  async login(user: Record<string, unknown>) {
    // For students, look up their Student record to get the student table ID
    let studentRecordId: string | null = null;
    if (user.roleId === 'student' && user.email) {
      const studentRecord = await this.studentsService.findByEmail(
        user.email as string,
      );
      if (studentRecord) {
        studentRecordId = studentRecord.id;
      }
    }

    const school = user.school as
      | { features?: string[]; plan?: string }
      | undefined;

    const payload = {
      email: user.email,
      sub: user.id,
      roleId: user.roleId,
      schoolId: user.schoolId,
      features: school?.features || [],
      plan: school?.plan || 'Free',
      ...(studentRecordId && { studentRecordId }),
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
        studentRecordId,
      },
    };
  }
}
