
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('export_jobs')
export class ExportJob {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column() tenant: string;
  @Column() type: string;
  @Column({ type: 'jsonb' }) params: any;
  @Column({ default: 'done' }) status: 'done' | 'error'; 
  @Column({ nullable: true }) error: string;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
