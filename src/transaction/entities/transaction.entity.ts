import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Ticket } from "src/tickets/entity/ticket.entity"; 



export enum TransactionTypeName {
  PAYMENT = "Payment",
  SALES = "Sales",
}



@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "enum",
    enum: TransactionTypeName,
  })
  transaction_type_name: TransactionTypeName;

  @Column({ type: "numeric", precision: 18, scale: 2 })
  amount: number;

  @Column({ type: "timestamptz" })
  transaction_time: Date;

  @Column({ type: "int" })
  ticket_id: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.transactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "ticket_id" })
  ticket: Ticket;
}
