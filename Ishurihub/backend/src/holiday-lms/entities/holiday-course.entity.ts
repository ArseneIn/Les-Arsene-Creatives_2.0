import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity('holiday_courses')
export class HolidayCourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  schoolId: string;

  @Column()
  grade: string; // e.g., 'Grade 10', 'S3'

  @OneToMany(() => Activity, (activity) => activity.course)
  activities: Activity[];

  @CreateDateColumn()
  createdAt: Date;
}
