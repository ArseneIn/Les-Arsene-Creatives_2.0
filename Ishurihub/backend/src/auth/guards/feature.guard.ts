import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FEATURE_KEY } from '../decorators/require-feature.decorator';
import { Feature } from '../../subscriptions/enums/feature.enum';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredFeatures = this.reflector.getAllAndOverride<Feature[]>(
      FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredFeatures || requiredFeatures.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Super Admin has access to everything
    if (user.role === 'super_admin' || user.roleId === 'super_admin') {
      return true;
    }

    const schoolFeatures = user.features || [];

    const hasAllFeatures = requiredFeatures.every((feature) =>
      schoolFeatures.includes(feature),
    );

    if (!hasAllFeatures) {
      throw new ForbiddenException(
        `This feature is not available in your school's current plan. Please contact the platform administrator to upgrade.`,
      );
    }

    return true;
  }
}
