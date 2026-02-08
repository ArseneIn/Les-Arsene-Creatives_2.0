import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    const book = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(book);
  }

  findAll(schoolId: string) {
    return this.booksRepository.find({ where: { schoolId } });
  }

  findOne(id: string) {
    return this.booksRepository.findOneBy({ id });
  }

  remove(id: string) {
    return this.booksRepository.delete(id);
  }
}
