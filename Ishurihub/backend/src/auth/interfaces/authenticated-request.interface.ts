import { Request } from '@nestjs/common';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string | { id: string; name: string };
    schoolId: string;
  };
}
