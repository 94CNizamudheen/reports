
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SalesService {
  constructor(@InjectRepository(Ticket) private tickets: Repository<Ticket>) {}
  async getDailySummary(date: string) {
    const qb = this.tickets.createQueryBuilder('t')
      .select('t.business_date', 'business_date')
      .addSelect('COUNT(*)', 'tickets')
      .addSelect('SUM(t.ticket_amount::numeric)', 'gross')
      .where('t.business_date = :d', { d: date })
      .groupBy('t.business_date');
    return qb.getRawOne();
  }
}
