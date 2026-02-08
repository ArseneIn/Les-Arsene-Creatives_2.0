import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './entities/classroom.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { RandomizeStudentsDto } from './dto/randomize-students.dto';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Classroom)
    private classroomsRepository: Repository<Classroom>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) { }

  async create(createClassDto: CreateClassDto): Promise<Classroom> {
    const { year, stream, schoolId, name } = createClassDto;

    // Duplicate Check
    const existing = await this.classroomsRepository.findOne({
      where: { year, stream, schoolId },
    });
    // Check by name as well to handle "S1 A" vs "S1" cases if stream is optional/empty
    const existingName = await this.classroomsRepository.findOne({
      where: { name, schoolId }
    });

    if (existing || existingName) {
      throw new Error('Class with this Name or Stream already exists for this Year.');
    }

    const newClass = this.classroomsRepository.create(createClassDto);
    const savedClass = await this.classroomsRepository.save(newClass);

    // Auto-sync students who might already have this grade string assigned
    await this.syncClassStudents(savedClass.id);

    return savedClass;
  }

  async syncClassStudents(classId: string) {
    const classroom = await this.classroomsRepository.findOne({ where: { id: classId } });
    if (!classroom) return;

    // Find students who have the class name as their grade but might have missing year/section
    // or just to ensure consistency
    const students = await this.studentsRepository.find({
      where: { grade: classroom.name, schoolId: classroom.schoolId }
    });

    for (const student of students) {
      let modified = false;
      if (student.year !== classroom.year) { student.year = classroom.year; modified = true; }
      if (student.section !== classroom.stream) { student.section = classroom.stream; modified = true; }
      if (student.level !== classroom.level) { student.level = classroom.level; modified = true; }
      if (classroom.level === 'A-Level' && !student.combination) {
        // Try to extract combination if missing
        // Re-use logic or just trust stream if stream is the combo
        if (classroom.stream && /^[A-Z]{3}$/.test(classroom.stream)) {
          student.combination = classroom.stream;
          modified = true;
        }
      }

      if (modified) {
        await this.studentsRepository.save(student);
      }
    }
  }

  async update(id: string, updateClassDto: Partial<CreateClassDto>): Promise<Classroom> {
    const classroom = await this.classroomsRepository.findOne({ where: { id } });
    if (!classroom) throw new NotFoundException('Class not found');

    // Check duplicates if name/stream changes
    if (updateClassDto.name && updateClassDto.name !== classroom.name) {
      const existing = await this.classroomsRepository.findOne({
        where: { name: updateClassDto.name, schoolId: classroom.schoolId }
      });
      if (existing) throw new Error('Class name already exists');
    }

    Object.assign(classroom, updateClassDto);
    const savedClass = await this.classroomsRepository.save(classroom);

    // If name, year, or stream changed, we should update linked students to reflect new details
    if (updateClassDto.name || updateClassDto.year || updateClassDto.stream) {
      // Note: query using NEW values might fail if we just changed them and students act on OLD values.
      // Actually, wait. 'findStudents' relies on year/section matching. 
      // If we changed Class.year from S1 to S2. Students are S1. They are now unlinked in the eyes of 'findStudents'.
      // We need to fetch students BEFORE saving the class, or we need to handle this relationship better.
      // Since we don't have a direct 'classId' on Student (we rely on logic), this is tricky.
      // Ideally Student should have 'classId'. But the user logic is 'year/section'.

      // Let's assume for now Sync is primarily for Creation as requested.
      // "Immediately retrieve them once the class exists"

      // However, calling sync here acts as "Claiming". If I rename class to "S1 B", and there are students named "S1 B", link them.
      await this.syncClassStudents(savedClass.id);
    }

    return savedClass;
  }

  async findAll(schoolId: string): Promise<any[]> {
    const classes = await this.classroomsRepository.find({
      where: { schoolId },
      order: { year: 'ASC', name: 'ASC' }
    });

    // Since we don't have a direct relation, we must count manually or use a smarter query.
    // For performance, we could use a single query builder, but let's iterate for now if dataset is small, 
    // OR better: use a specialized query.

    // Let's attach the count.
    const result: any[] = [];
    for (const cls of classes) {
      const count = await this.studentsRepository.count({
        where: {
          schoolId,
          year: cls.year,
          section: cls.stream // Matches logic in findStudents
        }
      });
      result.push({ ...cls, _count: { students: count } });
    }
    return result;
  }

  private readonly logger = new Logger(ClassesService.name);

  async randomizeStudents(
    dto: RandomizeStudentsDto,
  ): Promise<{ message: string; updatedCount: number }> {
    const { year, streams, schoolId } = dto;
    this.logger.log(
      `Randomizing students for Year: ${year}, Streams: ${Array.isArray(streams) ? streams.join(', ') : streams
      }, School: ${schoolId}`,
    );

    const isALevel = ['S4', 'S5', 'S6'].some((l) => year.startsWith(l));

    // 1. Fetch students
    const students = await this.studentsRepository.find({
      where: { year, schoolId },
    });

    if (students.length === 0) {
      throw new NotFoundException(`No students found in year ${year}`);
    }

    let updatedCount = 0;

    if (isALevel) {
      // --- A-LEVEL LOGIC (Combination Based) ---
      // Group students by combination
      const studentsByCombo: Record<string, Student[]> = {};

      for (const student of students) {
        if (!student.combination) continue; // Skip if no combination
        if (!studentsByCombo[student.combination]) {
          studentsByCombo[student.combination] = [];
        }
        studentsByCombo[student.combination].push(student);
      }

      // For each combination, find/create class and assign
      for (const [combo, comboStudents] of Object.entries(studentsByCombo)) {
        // Find or Create Class for this combination
        let classroom = await this.classroomsRepository.findOne({
          where: { year, name: `${year} ${combo}`, schoolId },
        });

        if (!classroom) {
          classroom = this.classroomsRepository.create({
            name: `${year} ${combo}`,
            year,
            stream: combo, // For A-Level, stream is the combination
            level: 'A-Level',
            schoolId,
          });
          await this.classroomsRepository.save(classroom);
        }

        // Assign all students of this combo to this class
        for (const student of comboStudents) {
          student.section = classroom.stream;
          await this.studentsRepository.save(student);
          updatedCount++;
        }
      }
      return {
        message: `Processed A-Level students. Assigned based on ${Object.keys(studentsByCombo).length} combinations found.`,
        updatedCount,
      };
    } else {
      // --- O-LEVEL LOGIC (Random Stream Distribution) ---

      // Shuffle
      for (let i = students.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [students[i], students[j]] = [students[j], students[i]];
      }

      // Ensure classrooms exist
      const classrooms: Classroom[] = [];
      const streamList = Array.isArray(streams)
        ? streams
        : (streams as string).split(',');

      for (const stream of streamList) {
        let classroom = await this.classroomsRepository.findOne({
          where: { year, stream: stream.trim(), schoolId },
        });

        if (!classroom) {
          classroom = this.classroomsRepository.create({
            name: `${year} ${stream.trim()}`,
            year,
            stream: stream.trim(),
            level: 'O-Level',
            schoolId,
          });
          await this.classroomsRepository.save(classroom);
        }
        classrooms.push(classroom);
      }

      // Distribute
      const updates: Promise<Student>[] = [];
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const assignedClass = classrooms[i % classrooms.length];

        student.section = assignedClass.stream;
        updates.push(this.studentsRepository.save(student));
      }
      await Promise.all(updates);
      updatedCount = students.length;

      return {
        message: `Successfully randomized ${students.length} students into ${streamList.length} streams`,
        updatedCount,
      };
    }
  }

  async addStudents(classId: string, studentIds: string[]): Promise<{ message: string; updatedCount: number }> {
    const classroom = await this.classroomsRepository.findOne({ where: { id: classId } });
    if (!classroom) throw new NotFoundException('Class not found');

    if (!studentIds || studentIds.length === 0) {
      return { message: 'No students provided', updatedCount: 0 };
    }

    const students = await this.studentsRepository.findByIds(studentIds);

    let updatedCount = 0;
    for (const student of students) {
      student.year = classroom.year;
      student.level = classroom.level;
      student.section = classroom.stream;
      // Update grade display name
      const streamSuffix = classroom.stream ? ` ${classroom.stream}` : '';
      student.grade = `${classroom.year}${streamSuffix}`;

      if (classroom.level === 'A-Level' && classroom.stream) {
        // Extract combination from stream (e.g., "MCE A" -> "MCE")
        const parts = classroom.stream.split(' ');
        const combo = parts.find(p => /^[A-Z]{3}$/.test(p) && !['III', 'IV'].includes(p));
        if (combo) student.combination = combo;
        else if (/^[A-Z]{3}$/.test(classroom.stream)) student.combination = classroom.stream;
      }

      await this.studentsRepository.save(student);
      updatedCount++;
    }

    return {
      message: `Successfully added ${updatedCount} students to ${classroom.name}`,
      updatedCount
    };
  }

  async findStudents(classId: string): Promise<Student[]> {
    const classroom = await this.classroomsRepository.findOne({
      where: { id: classId },
    });
    if (!classroom) {
      throw new NotFoundException('Class not found');
    }

    return this.studentsRepository.find({
      where: {
        year: classroom.year,
        section: classroom.stream,
        schoolId: classroom.schoolId,
      },
      order: { name: 'ASC' },
    });
  }

  async remove(id: string): Promise<void> {
    await this.classroomsRepository.delete(id);
  }
}
