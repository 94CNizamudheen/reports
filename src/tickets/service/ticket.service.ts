import { Injectable, NotFoundException } from '@nestjs/common';
import { TicketRepository } from '../repository/ticket.repository';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { Ticket } from '../entity/ticket.entity';
import { UpdateTicketDto } from '../dto/update-ticket.dto';


@Injectable()
export class TicketsService {
  constructor(private readonly ticketRepo: TicketRepository) {}

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const ticket =  this.ticketRepo.create(dto);
    return this.ticketRepo.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketRepo.find({
      relations: ['orders', 'payments', 'transactions', 'logs'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['orders', 'payments', 'transactions', 'logs'],
    });
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
    return ticket;
  }

  async update(id: number, dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);
    Object.assign(ticket, dto);
    return this.ticketRepo.save(ticket);
  }

  async remove(id: number): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketRepo.remove(ticket);
  }

  async getReport(from: Date, to: Date, locationId?: number, department?: string) {
    return this.ticketRepo.findTicketsForReport(from, to, locationId, department);
  }
}
