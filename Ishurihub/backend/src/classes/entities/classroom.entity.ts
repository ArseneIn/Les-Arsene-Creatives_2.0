import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('classrooms')
export class Classroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g. "Senior 1 A"

  @Column()
  year: string; // e.g. "S1"

  @Column()
  level: string; // "O-Level" or "A-Level"

  @Column({ nullable: true })
  stream: string; // e.g. "A", "B", "Blue", "Red"

  @Column({ nullable: true })
  capacity: number;

  @Column()
  schoolId: string;

  @Column({ nullable: true })
  academicYearId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
