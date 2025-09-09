import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('payment_types')
export class PaymentType {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({ unique: true }) name: string; 
}
