
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column() name: string;
  @Column('numeric', { precision: 18, scale: 2 }) price: string; 
  @Column({ default: true }) isActive: boolean;
}
