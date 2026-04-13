import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Subject } from '../../subjects/entities/subject.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Classroom } from '../../classes/entities/classroom.entity';
import { AcademicYear } from '../../academic-years/entities/academic-year.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subjectId: string;

  @ManyToOne(() => Subject)
  subject: Subject;

  @Column()
  teacherId: string;

  @ManyToOne(() => Teacher)
  teacher: Teacher;

  @Column()
  classId: string;

  @ManyToOne(() => Classroom)
  classroom: Classroom;

  @Column()
  academicYearId: string;

  @ManyToOne(() => AcademicYear)
  academicYear: AcademicYear;

  @Column({ type: 'float', default: 1.0 })
  credits: number; // weight for grading

  @Column()
  schoolId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
