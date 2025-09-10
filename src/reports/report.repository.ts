import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../sales/entities/ticket.entity';

@Injectable()
export class ReportsRepository {
  constructor(
    @InjectRepository(Ticket) private readonly tickets: Repository<Ticket>,
  ) {}

  async findTicketsByDate(date: string) {
    return this.tickets.find({
      where: { business_date: date },
      relations: ['orders', 'payments', 'transactions'],
    });
  }
}
