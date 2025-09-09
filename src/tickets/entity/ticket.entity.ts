import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    OneToMany,
} from 'typeorm';
import { TicketLog } from './tickets.log.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

export enum TicketStateType {
    COMPLETED = "completed",
    VOID = "void",
    REFUND = "refund",
    RETURN = "return",
};
export interface TicketState {
    completed?: boolean;
    void?: boolean;
    refund?: boolean;
    return?: boolean;
}

export interface Promotion {
    included: boolean;
    id: number;
    amount: number;
}

export interface Delivery {
    id: number;
    pos_sync: boolean;
}

export interface ChannelUser {
    created_by: string;
    updated_by?: string;
}

export interface Ext {
    note?: string;
}

export interface ExternalSync {
    [key: string]: any;
}

@Entity('tickets')
@Unique(['ticket_number', 'location_id'])
export class Ticket {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar' })
    channel_name: string;

    @Column({ type: 'uuid' })
    ticket_id: string;

    @Column({ type: 'int' })
    ticket_number: number;

    @Column({ type: 'int' })
    location_id: number;

    @Column({ type: 'int' })
    sale_location_id: number;

    @Column({ type: 'varchar', nullable: true })
    invoice_no: string;

    @Column({ type: 'boolean', default: false })
    refund: boolean;

    @Column({
        type: 'numeric',
        precision: 18,
        scale: 2,
        transformer: {
            to: (value: number) => value,     
            from: (value: string) => parseFloat(value), 
        },
    })
    ticket_amount: number;

    @Column({ type: 'boolean', default: false })
    tax_inclusive: boolean;

    @Column({ type: 'varchar', nullable: true })
    department_name: string;

    @Column({ type: 'jsonb', nullable: true })
    tags: any;

    @Column({ type: 'jsonb', nullable: true })
    ticket_state: TicketState;

    @Column({ type: 'boolean', default: false })
    pre_order: boolean;

    @Column({ type: 'int', nullable: true })
    work_period_id: number;

    @Column({ type: 'jsonb', nullable: true })
    promotion: Promotion;

    @Column({ type: 'jsonb', nullable: true })
    delivery: Delivery;

    @Column({ type: 'varchar', nullable: true })
    terminal: string;

    @Column({ type: 'int', nullable: true })
    queue_number: number;

    @Column({ type: 'jsonb', nullable: true })
    channel_user: ChannelUser;

    @Column({ type: 'jsonb', nullable: true })
    ext: Ext;

    @Column({ type: 'jsonb', nullable: true })
    external_sync: ExternalSync;

    @Column({ type: 'date', nullable: true })
    business_date: Date;

    @Column({ type: 'timestamptz', nullable: true })
    ticket_created_time: Date;

    @Column({ type: 'timestamptz', nullable: true })
    ticket_updated_time: Date;

    @Column({ type: 'timestamptz', nullable: true })
    last_order_time: Date;

    @Column({ type: 'date', nullable: true })
    last_payment_date: Date;

    @Column({ type: 'timestamptz', nullable: true })
    last_payment_time: Date;

    @Column({ type: 'date', nullable: true })
    delivery_date: Date;

    @Column({ type: 'timestamptz', nullable: true })
    delivery_time: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;


    @OneToMany(() => TicketLog, (log) => log.ticket)
    logs: TicketLog[];

    @OneToMany(() => Order, (order) => order.ticket)
    orders: Order[];

    @OneToMany(() => Payment, (payment) => payment.ticket)
    payments: Payment[];

    @OneToMany(() => Transaction, (transaction) => transaction.ticket)
    transactions: Transaction[];
}
