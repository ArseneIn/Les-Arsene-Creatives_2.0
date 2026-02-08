import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import {
  BorrowingRecord,
  BorrowingStatus,
} from './entities/borrowing-record.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { IssueBookDto } from './dto/issue-book.dto';
import { StudentsService } from '../students/students.service';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(BorrowingRecord)
    private borrowingRepository: Repository<BorrowingRecord>,
    private studentsService: StudentsService,
  ) {}

  async createBook(createBookDto: CreateBookDto) {
    const book = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(book);
  }

  async findAllBooks(schoolId: string) {
    return this.booksRepository.find({
      where: { schoolId },
      order: { title: 'ASC' },
    });
  }

  async findOneBook(id: string) {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
    return book;
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.findOneBook(id);
    Object.assign(book, updateBookDto);
    return this.booksRepository.save(book);
  }

  async removeBook(id: string) {
    const book = await this.findOneBook(id);
    return this.booksRepository.remove(book);
  }

  async issueBook(dto: IssueBookDto) {
    const book = await this.findOneBook(dto.bookId);

    if (book.availableCopies <= 0) {
      throw new BadRequestException('Book is currently not available');
    }

    // Create borrowing record
    const record = this.borrowingRepository.create({
      ...dto,
      borrowedAt: new Date(),
      status: BorrowingStatus.BORROWED,
    });

    // Decrement available count
    book.availableCopies -= 1;
    await this.booksRepository.save(book);

    return this.borrowingRepository.save(record);
  }

  async returnBook(id: string) {
    const record = await this.borrowingRepository.findOne({
      where: { id },
      relations: ['book'],
    });

    if (!record) throw new NotFoundException('Borrowing record not found');
    if (record.status === BorrowingStatus.RETURNED) {
      throw new BadRequestException('Book already returned');
    }

    record.status = BorrowingStatus.RETURNED;
    record.returnedAt = new Date();

    // Increment available count
    if (record.book) {
      record.book.availableCopies += 1;
      await this.booksRepository.save(record.book);
    }

    return this.borrowingRepository.save(record);
  }

  async findAllIssued(schoolId: string) {
    return this.borrowingRepository.find({
      where: { schoolId, status: BorrowingStatus.BORROWED },
      relations: ['book'],
      order: { borrowedAt: 'DESC' },
    });
  }

  async findStudentByCard(cardUid: string) {
    const student = await this.studentsService.findByCardUid(cardUid);
    if (!student) throw new NotFoundException('Student card not registered');
    return student;
  }

  async findByStudent(studentId: string) {
    const active = await this.borrowingRepository.find({
      where: { studentId, status: BorrowingStatus.BORROWED },
      relations: ['book'],
      order: { borrowedAt: 'DESC' },
    });

    const history = await this.borrowingRepository.find({
      where: { studentId },
      relations: ['book'],
      order: { borrowedAt: 'DESC' },
      take: 20, // Limit history
    });

    return { active, history };
  }
}
