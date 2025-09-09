import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('ticket_logs')
export class TicketLog {
  @PrimaryGeneratedColumn('increment') id: number;
  @ManyToOne(() => Ticket, t => t.logs, { onDelete: 'CASCADE' }) ticket: Ticket;
  @Column({ type: 'jsonb' }) logs: any;
}
