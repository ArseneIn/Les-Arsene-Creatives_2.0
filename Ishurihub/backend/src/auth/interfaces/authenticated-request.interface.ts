import { Request } from '@nestjs/common';

export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
        role: any;
        schoolId: string;
    }
}
