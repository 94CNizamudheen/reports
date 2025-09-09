import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('transaction_types')
export class TransactionType {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({ unique: true }) name: string; 
}
