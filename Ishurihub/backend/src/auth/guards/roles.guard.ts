import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        // Logic: 
        // 1. If user is SUPER_ADMIN, allow everything (optional but good practice)
        // 2. If user role (or roleId/name) is in requiredRoles, allow.

        // Adjust based on your User entity structure (role vs roleId)
        // JWT strategy returns: { userId, email, role (obj or string?), schoolId }

        // Assuming user.role.id or user.role is the string identifier
        // Let's assume user.role is an object with 'id' or 'name', or just a string 'roleId'.
        // Looking at jwt.strategy, it maps payload.role.

        // Quick fix: Check both simple string match or object match
        const userRole = user.role?.id || user.role || user.roleId;

        return requiredRoles.some((role) => role === userRole);
    }
}
