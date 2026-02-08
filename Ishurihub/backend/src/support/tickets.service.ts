import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const ticket = this.ticketsRepository.create(createTicketDto);
    return this.ticketsRepository.save(ticket);
  }

  async findAll() {
    return this.ticketsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findBySchool(schoolId: string) {
    return this.ticketsRepository.find({
      where: { schoolId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: string) {
    await this.ticketsRepository.update(id, { status });
    return this.ticketsRepository.findOneBy({ id });
  }
}
