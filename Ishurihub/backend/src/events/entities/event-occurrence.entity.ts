import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { SchoolEvent } from './school-event.entity';
import { EventAttendance } from './event-attendance.entity';

export enum OccurrenceStatus {
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    POSTPONED = 'POSTPONED',
}

@Entity('event_occurrences')
export class EventOccurrence {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    eventId: string;

    @ManyToOne(() => SchoolEvent, (event) => event.occurrences, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'eventId' })
    event: SchoolEvent;

    @Column({ type: 'date' })
    date: string;

    // Add startTime/endTime here if an occurrence differs from the main event
    @Column({ type: 'time', nullable: true })
    startTime: string;

    @Column({ type: 'time', nullable: true })
    endTime: string;

    @Column({
        type: 'enum',
        enum: OccurrenceStatus,
        default: OccurrenceStatus.SCHEDULED,
    })
    status: OccurrenceStatus;

    @Column({ type: 'text', nullable: true })
    note: string; // e.g., "Main hall unavailable, moved to gym"

    @OneToMany(() => EventAttendance, (attendance) => attendance.occurrence)
    attendances: EventAttendance[];

    @CreateDateColumn()
    createdAt: Date;
}
