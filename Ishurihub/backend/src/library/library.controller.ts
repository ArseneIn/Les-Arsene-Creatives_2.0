import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { IssueBookDto } from './dto/issue-book.dto';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post('books')
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.libraryService.createBook(createBookDto);
  }

  @Get('books')
  findAllBooks(@Query('schoolId') schoolId: string) {
    return this.libraryService.findAllBooks(schoolId);
  }

  @Get('books/:id')
  findOneBook(@Param('id') id: string) {
    return this.libraryService.findOneBook(id);
  }

  @Patch('books/:id')
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.libraryService.updateBook(id, updateBookDto);
  }

  @Delete('books/:id')
  removeBook(@Param('id') id: string) {
    return this.libraryService.removeBook(id);
  }

  @Post('issue')
  issueBook(@Body() issueBookDto: IssueBookDto) {
    return this.libraryService.issueBook(issueBookDto);
  }

  @Post('return/:id')
  returnBook(@Param('id') id: string) {
    return this.libraryService.returnBook(id);
  }

  @Get('issued')
  findAllIssued(@Query('schoolId') schoolId: string) {
    return this.libraryService.findAllIssued(schoolId);
  }

  @Get('students/card/:uid')
  findByCardUid(@Param('uid') uid: string) {
    return this.libraryService.findStudentByCard(uid);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.libraryService.findByStudent(studentId);
  }
}
