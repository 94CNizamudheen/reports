import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("payment_types")
export class PaymentType {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column({ type: "varchar", unique: true })
  name: string

  @Column({ type: "varchar", nullable: true })
  description: string

  @Column({ type: "boolean", default: true })
  is_active: boolean
}
