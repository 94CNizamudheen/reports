import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column() name: string;
}
