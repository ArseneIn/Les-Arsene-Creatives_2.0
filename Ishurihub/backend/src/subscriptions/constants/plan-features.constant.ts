import { Feature } from '../enums/feature.enum';

export const PLAN_FEATURES: Record<string, Feature[]> = {
  Free: [Feature.ACADEMIC_CORE, Feature.EVENTS, Feature.SUPPORT],
  Basic: [
    Feature.ACADEMIC_CORE,
    Feature.ATTENDANCE,
    Feature.EVENTS,
    Feature.SUPPORT,
  ],
  Standard: [
    Feature.ACADEMIC_CORE,
    Feature.ATTENDANCE,
    Feature.TIMETABLE,
    Feature.DISCIPLINE,
    Feature.LIBRARY,
    Feature.EVENTS,
    Feature.SUPPORT,
  ],
  Premium: [
    Feature.ACADEMIC_CORE,
    Feature.ATTENDANCE,
    Feature.TIMETABLE,
    Feature.DISCIPLINE,
    Feature.LIBRARY,
    Feature.FINANCE,
    Feature.HOLIDAY_LMS,
    Feature.EVENTS,
    Feature.SUPPORT,
  ],
};

export const DEFAULT_PLAN = 'Free';
