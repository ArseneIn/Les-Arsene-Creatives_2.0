import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HolidayCourse } from './entities/holiday-course.entity';
import { Activity, ActivityType } from './entities/activity.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { CompletionRecord } from './entities/completion-record.entity';
import { CompleteActivityDto } from './dto/complete-activity.dto';

@Injectable()
export class HolidayLmsService {
  constructor(
    @InjectRepository(HolidayCourse)
    private courseRepository: Repository<HolidayCourse>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(QuizQuestion)
    private questionRepository: Repository<QuizQuestion>,
    @InjectRepository(CompletionRecord)
    private completionRepository: Repository<CompletionRecord>,
  ) {}

  async findAllCourses(schoolId: string, grade?: string) {
    const where: any = { schoolId };
    if (grade) where.grade = grade;
    return this.courseRepository.find({ where, order: { title: 'ASC' } });
  }

  async findCourseDetails(courseId: string, studentId: string) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['activities'],
    });

    if (!course) throw new NotFoundException('Course not found');

    // Sort activities by orderIndex
    course.activities.sort((a, b) => a.orderIndex - b.orderIndex);

    // Fetch completion records for this student
    const completions = await this.completionRepository.find({
      where: { studentId },
    });

    const completionMap = new Map(completions.map((c) => [c.activityId, c]));

    // Map activities with locking logic
    const activitiesWithStatus = course.activities.map((activity, index) => {
      const completion = completionMap.get(activity.id);
      const isCompleted = !!completion;

      // Locking logic: First activity is always unlocked.
      // Others are unlocked if the previous one is completed.
      let isLocked = false;
      if (index > 0) {
        const prevActivityId = course.activities[index - 1].id;
        isLocked = !completionMap.has(prevActivityId);
      }

      return {
        ...activity,
        isCompleted,
        isLocked,
        score: completion?.score || null,
      };
    });

    return {
      ...course,
      activities: activitiesWithStatus,
    };
  }

  async findActivity(activityId: string, studentId: string) {
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
      relations: ['quizQuestions'],
    });

    if (!activity) throw new NotFoundException('Activity not found');

    // Check if prerequisite is met (Security check)
    const course = await this.findCourseDetails(activity.courseId, studentId);
    const activityInfo = course.activities.find((a) => a.id === activityId);

    if (activityInfo?.isLocked) {
      throw new ForbiddenException(
        'This activity is locked. Complete the previous activity first.',
      );
    }

    // Hide correct answers for quizzes if not completed
    if (activity.type === ActivityType.QUIZ && !activityInfo?.isCompleted) {
      activity.quizQuestions.forEach((q) => delete (q as any).correctAnswer);
    }

    return activity;
  }

  async completeActivity(studentId: string, dto: CompleteActivityDto) {
    const activity = await this.activityRepository.findOne({
      where: { id: dto.activityId },
      relations: ['quizQuestions'],
    });

    if (!activity) throw new NotFoundException('Activity not found');

    let score: number | null = null;
    const responses = dto.responses || {};

    if (activity.type === ActivityType.QUIZ) {
      // Auto-marking logic
      let totalPoints = 0;
      let earnedPoints = 0;

      activity.quizQuestions.forEach((q) => {
        totalPoints += q.points;
        const studentAnswer = responses[q.id];
        if (studentAnswer === q.correctAnswer) {
          earnedPoints += q.points;
        }
      });

      score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 100;
    }

    // Upsert completion record
    let record = await this.completionRepository.findOne({
      where: { studentId, activityId: dto.activityId },
    });

    if (!record) {
      record = this.completionRepository.create({
        studentId,
        activityId: dto.activityId,
        isCompleted: true,
        score,
        responses,
      });
    } else {
      record.isCompleted = true;
      record.score = score;
      record.responses = responses;
    }

    return this.completionRepository.save(record);
  }
}
