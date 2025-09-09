import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiKey } from './api-key.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column({ unique: true }) name: string;
  @Column({ default: true }) isActive: boolean;
  @OneToMany(() => ApiKey, k => k.tenant) apiKeys: ApiKey[];
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
