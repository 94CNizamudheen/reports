import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column({ type: "varchar" })
  name: string

  @Column({ type: "varchar" })
  address: string

  @Column({ type: "varchar", nullable: true })
  city: string

  @Column({ type: "varchar", nullable: true })
  state: string

  @Column({ type: "varchar", nullable: true })
  country: string

  @Column({ type: "boolean", default: true })
  is_active: boolean
}
