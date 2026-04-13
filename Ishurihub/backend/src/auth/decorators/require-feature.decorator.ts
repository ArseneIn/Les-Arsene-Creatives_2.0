import { SetMetadata } from '@nestjs/common';
import { Feature } from '../../subscriptions/enums/feature.enum';

export const FEATURE_KEY = 'features';
export const RequireFeature = (...features: Feature[]) =>
  SetMetadata(FEATURE_KEY, features);
