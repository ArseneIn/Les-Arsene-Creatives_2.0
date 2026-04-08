import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activityId: string;

  @ManyToOne(() => Activity, (activity) => activity.quizQuestions)
  @JoinColumn({ name: 'activityId' })
  activity: Activity;

  @Column()
  text: string;

  @Column({ type: 'jsonb' })
  options: string[];

  @Column()
  correctAnswer: string;

  @Column({ default: 1 })
  points: number;
}
