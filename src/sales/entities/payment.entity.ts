import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('increment') id: number;
  @ManyToOne(() => Ticket, t => t.payments, { onDelete: 'CASCADE' }) ticket: Ticket;

  @Column({ type: 'uuid' }) payment_id: string;
  @Column({ type: 'varchar' }) payment_type: string;
  @Column('numeric', { precision: 18, scale: 2 }) payment_amount: string;
  @Column('numeric', { precision: 18, scale: 2, default: 0 }) tip_amount: string;
  @Column('numeric', { precision: 18, scale: 2, nullable: true }) tendered_amount: string; // for cash
  @Column('numeric', { precision: 18, scale: 2 }) net_amount: string;
  @Column({ type: 'varchar', default: 'MYR' }) currency: string;
  @Column('numeric', { precision: 18, scale: 2, default: 1 }) currency_exchange_rate: string;
  @Column({ type: 'jsonb', nullable: true }) tags: any;
  @Column({ type: 'varchar', nullable: true }) terminal: string;
  @Column({ type: 'jsonb', nullable: true }) channel_user: any;

  @Column({ type: 'date' }) payment_date: string;
  @Column({ type: 'timestamptz' }) payment_time: Date;

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
