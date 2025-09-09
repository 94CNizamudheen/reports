import { DataSource, Repository, Between } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Ticket } from '../entity/ticket.entity'; 

@Injectable()
export class TicketRepository extends Repository<Ticket> {
  constructor(private dataSource: DataSource) {
    super(Ticket, dataSource.createEntityManager());
  }

  async findTicketsForReport(
    from: Date,
    to: Date,
    locationId?: number,
    department?: string,
  ): Promise<Ticket[]> {
    const where: any = { created_at: Between(from, to) };
    if (locationId) where.location_id = locationId;
    if (department) where.department_name = department;

    return this.find({
      where,
      relations: ['orders', 'payments', 'transactions', 'logs'],
      order: { created_at: 'ASC' },
    });
  }
}
