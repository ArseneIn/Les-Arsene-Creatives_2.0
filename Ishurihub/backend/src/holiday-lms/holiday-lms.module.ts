import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayLmsController } from './holiday-lms.controller';
import { HolidayLmsService } from './holiday-lms.service';
import { HolidayCourse } from './entities/holiday-course.entity';
import { Activity } from './entities/activity.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { CompletionRecord } from './entities/completion-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HolidayCourse,
      Activity,
      QuizQuestion,
      CompletionRecord,
    ]),
  ],
  controllers: [HolidayLmsController],
  providers: [HolidayLmsService],
  exports: [HolidayLmsService],
})
export class HolidayLmsModule {}
