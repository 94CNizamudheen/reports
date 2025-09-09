import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import type {
  TaxDetail,
  ChargeDetail,
  OrderState,
  OrderPromotion,
  Upselling,
  OrderChannelUser,
  OrderExt,
} from '../../types';
import { numericTransformer, OrderItemType } from '../../types';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Ticket, t => t.orders, { onDelete: 'CASCADE' })
  ticket!: Ticket;

  @Column({ type: 'uuid' })
  order_id!: string;

  @Column({ type: 'int' })
  location_id!: number;

  @Column({ type: 'varchar', nullable: true })
  department_name?: string | null;

  @Column({ type: 'enum', enum: OrderItemType })
  order_item_type!: OrderItemType;

  @Column({ type: 'varchar', nullable: true })
  product_name?: string | null;

  @Column({ type: 'varchar', nullable: true })
  tag_name?: string | null;

  @Column({ type: 'int' })
  quantity!: number;

  @Column('numeric', { precision: 18, scale: 2, transformer: numericTransformer })
  order_amount!: number;

  @Column({ type: 'boolean', default: true })
  tax_inclusive!: boolean;

  @Column('numeric', { precision: 18, scale: 2, default: 0, transformer: numericTransformer })
  tax_amount!: number;

  @Column({ type: 'jsonb', nullable: true })
  tax_detail?: TaxDetail | null;

  @Column('numeric', { precision: 18, scale: 2, transformer: numericTransformer })
  net_amount!: number;

  @Column('numeric', { precision: 18, scale: 2, default: 0, transformer: numericTransformer })
  charge_amount!: number;

  @Column({ type: 'jsonb', nullable: true })
  charge_detail?: ChargeDetail | null;

  @Column({ type: 'jsonb', nullable: true })
  order_state?: OrderState | null;

  @Column({ type: 'jsonb', nullable: true })
  promotion?: OrderPromotion | null;

  @Column({ type: 'jsonb', nullable: true })
  upselling?: Upselling | null;

  @Column({ type: 'jsonb', nullable: true })
  channel_user?: OrderChannelUser | null;

  @Column({ type: 'jsonb', nullable: true })
  ext?: OrderExt | null;

  @Column({ type: 'date' })
  business_date!: string; // yyyy-MM-dd

  @Column({ type: 'date' })
  order_date!: string;

  @Column({ type: 'timestamptz' })
  order_time!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
