import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('ticket_logs')
export class TicketLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.logs, { onDelete: 'CASCADE' })
  ticket: Ticket;

  @Column({ type: 'jsonb' })
  logs: any;
}
