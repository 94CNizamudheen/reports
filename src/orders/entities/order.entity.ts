import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Ticket } from 'src/tickets/entity/ticket.entity'; 

export enum OrderItemType {
  PRODUCT = "Product",
  TAG = "Tag",
  COMBO_ITEM = "ComboItem",
}


export interface TaxDetail {
  GST?: number;
  VAT?: number;
  [key: string]: number | undefined;
}

export interface ChargeDetail {
  service_charge?: number;
  packing_fee?: number;
  discount?: number;
  promotion?: number;
}

export interface OrderState {
  gift?: boolean;
  void?: boolean;
  comp?: boolean;
  return?: boolean;
  refund?: boolean;
  submitted?: boolean;
}

export interface OrderPromotion {
  id: number;
}

export interface Upselling {
  id: number;
}

export interface OrderChannelUser {
  created_by: string;
}

export interface OrderExt {
  note?: string;
}


@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.orders, { onDelete: 'CASCADE' })
  ticket: Ticket;

  @Column({ type: 'uuid' })
  order_id: string;

  @Column({ type: 'int' })
  location_id: number;

  @Column({ type: 'varchar', nullable: true })
  department_name: string;

  @Column({
    type: "enum",
    enum: OrderItemType,
  })
  order_item_type: OrderItemType;

  @Column({ type: 'varchar', nullable: true })
  product_name: string;

  @Column({ type: 'varchar', nullable: true })
  tag_name: string;

  @Column({ type: 'varchar', nullable: true })
  combo_item_name: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  order_amount: string;

  @Column({ type: 'boolean', default: false })
  tax_inclusive: boolean;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  tax_amount: string;

  @Column({ type: 'jsonb', nullable: true })
  tax_detail: TaxDetail;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  net_amount: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  charge_amount: string;

  @Column({ type: 'jsonb', nullable: true })
  charge_detail: ChargeDetail;

  @Column({ type: 'jsonb', nullable: true })
  order_state: OrderState;

  @Column({ type: 'jsonb', nullable: true })
  promotion: OrderPromotion;

  @Column({ type: 'jsonb', nullable: true })
  upselling: Upselling;

  @Column({ type: 'jsonb', nullable: true })
  channel_user: OrderChannelUser;

  @Column({ type: 'jsonb', nullable: true })
  ext: OrderExt;

  @Column({ type: 'date', nullable: true })
  business_date: Date;

  @Column({ type: 'date', nullable: true })
  order_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  order_time: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
