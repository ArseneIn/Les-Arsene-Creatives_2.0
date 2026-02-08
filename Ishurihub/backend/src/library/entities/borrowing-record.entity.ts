import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Book } from './book.entity';

export enum BorrowingStatus {
  BORROWED = 'Borrowed',
  RETURNED = 'Returned',
  OVERDUE = 'Overdue',
}

@Entity('borrowing_records')
export class BorrowingRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookId: string;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column({ nullable: true })
  studentId: string;

  @Column({ nullable: true })
  teacherId: string;

  @Column({ type: 'timestamp' })
  borrowedAt: Date;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt: Date;

  @Column({
    type: 'enum',
    enum: BorrowingStatus,
    default: BorrowingStatus.BORROWED,
  })
  status: BorrowingStatus;

  @Column()
  schoolId: string;
}
