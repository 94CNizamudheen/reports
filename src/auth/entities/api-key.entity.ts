import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from './tenent.entity'; 

@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({ unique: true }) key: string;
  @ManyToOne(() => Tenant, t => t.apiKeys, { eager: true, onDelete: 'CASCADE' })
  tenant: Tenant;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
