import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('transactions')
export class Trx {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({ type: 'varchar' }) transactionTypeName: string; 
  @Column('numeric', { precision: 18, scale: 2 }) amount: string;
  @Column({ type: 'timestamptz' }) transactionTime: Date;
  @ManyToOne(() => Ticket, t => t.transactions, { onDelete: 'CASCADE' }) ticket: Ticket;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
