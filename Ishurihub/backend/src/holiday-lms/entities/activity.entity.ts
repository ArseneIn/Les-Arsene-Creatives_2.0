import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { HolidayCourse } from './holiday-course.entity';
import { QuizQuestion } from './quiz-question.entity';

export enum ActivityType {
  READING = 'READING',
  VIDEO = 'VIDEO',
  QUIZ = 'QUIZ',
}

@Entity('course_activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courseId: string;

  @ManyToOne(() => HolidayCourse, (course) => course.activities)
  @JoinColumn({ name: 'courseId' })
  course: HolidayCourse;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
    default: ActivityType.READING,
  })
  type: ActivityType;

  @Column({ type: 'text', nullable: true })
  content: string; // Markdown for Reading, Embedded URL for Video

  @Column({ default: 0 })
  orderIndex: number;

  @OneToMany(() => QuizQuestion, (question) => question.activity)
  quizQuestions: QuizQuestion[];

  @CreateDateColumn()
  createdAt: Date;
}
