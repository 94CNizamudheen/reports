import type { TicketState, ChannelUser, Ext, ExternalSync } from '../../types';
import { numericTransformer } from '../../types';
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { Payment } from './payment.entity';
import { Trx } from './transaction.entity';
import { TicketLog } from './ticket-log.entity';

@Entity('tickets')
@Index('uix_ticket_location_ticketnumber', ['location_id', 'ticket_number'], { unique: true })
export class Ticket {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', nullable: true })
    channel_name: string;

    @Column({ type: 'uuid' })
    ticket_id: string;

    @Column({ type: 'int' })
    ticket_number: number;

    @Column({ type: 'int' })
    location_id: number;

    @Column({ type: 'int', nullable: true })
    sale_location_id: number;

    @Column({ type: 'varchar', nullable: true })
    invoice_no: string;

    @Column({ type: 'boolean', default: false })
    refund: boolean;

    @Column('numeric', { precision: 18, scale: 2, transformer: numericTransformer })
    ticket_amount!: number;

    @Column({ type: 'boolean', default: true })
    tax_inclusive: boolean;

    @Column({ type: 'varchar', nullable: true })
    ordermode_name: string;

    @Column({ type: 'jsonb', nullable: true })
    tags: Record<string, any>;

    @Column({ type: 'jsonb', nullable: true })
    ticket_state: TicketState;

    @Column({ type: 'varchar', nullable: true })
    terminal: string;

    @Column({ type: 'int', nullable: true })
    queue_number: number;

    @Column({ type: 'jsonb', nullable: true })
    channel_user: ChannelUser;

    @Column({ type: 'jsonb', nullable: true })
    ext: Ext;

    @Column({ type: 'jsonb', nullable: true })
    external_sync?: ExternalSync | null;

    @Column({ type: 'date' })
    business_date: string;

    @Column({ type: 'timestamptz' })
    ticket_created_time: Date;

    @Column({ type: 'timestamptz', nullable: true })
    ticket_updated_time: Date;

    @Column({ type: 'timestamptz', nullable: true })
    last_order_time: Date;

    @Column({ type: 'date', nullable: true })
    last_payment_date: string;

    @Column({ type: 'timestamptz', nullable: true })
    last_payment_time: Date;

    @Column({ type: 'date', nullable: true })
    delivery_date: string;

    @Column({ type: 'timestamptz', nullable: true })
    delivery_time: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @OneToMany(() => Order, o => o.ticket, { cascade: true })
    orders: Order[];

    @OneToMany(() => Payment, p => p.ticket, { cascade: true })
    payments: Payment[];

    @OneToMany(() => Trx, t => t.ticket, { cascade: true })
    transactions: Trx[];

    @OneToMany(() => TicketLog, l => l.ticket, { cascade: true })
    logs: TicketLog[];
}
