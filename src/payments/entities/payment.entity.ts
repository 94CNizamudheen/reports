import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Ticket } from 'src/tickets/entity/ticket.entity'; 

export interface PaymentTags {
  [key: string]: any;
}

export interface PaymentChannelUser {
  created_by: string;
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.payments, { onDelete: 'CASCADE' })
  ticket: Ticket;

  @Column({ type: 'uuid' })
  payment_id: string;

  @Column({ type: 'varchar' })
  payment_type: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  payment_amount: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  tip_amount: string;

  @Column({ type: "numeric", precision: 18, scale: 2, nullable: true })
  tendered_amount?: number; 

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  net_amount: string;

  @Column({ type: 'varchar', nullable: true })
  currency: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  currency_exchange_rate: string;

  @Column({ type: 'jsonb', nullable: true })
  tags?: PaymentTags;

  @Column({ type: 'varchar', nullable: true })
  terminal: string;

  @Column({ type: 'jsonb', nullable: true })
  channel_user: PaymentChannelUser;

  @Column({ type: 'date', nullable: true })
  payment_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  payment_time: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

