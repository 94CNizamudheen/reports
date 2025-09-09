import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column({ type: "varchar" })
  name: string

  @Column({ type: "varchar", nullable: true })
  description: string

  @Column({ type: "numeric", precision: 18, scale: 2 })
  price: number

  @Column({ type: "varchar", nullable: true })
  category: string

  @Column({ type: "boolean", default: true })
  is_active: boolean
}
