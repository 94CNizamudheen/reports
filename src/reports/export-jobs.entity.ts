
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('export_jobs')
export class ExportJob {
  @PrimaryGeneratedColumn('increment') id: number;
  @Column() tenant: string;
  @Column() type: string; // 'daily-sales' etc.
  @Column({ type: 'jsonb' }) params: any;
  @Column({ default: 'queued' }) status: 'queued' | 'running' | 'done' | 'error';
  @Column({ nullable: true }) filePath: string;
  @Column({ nullable: true }) error: string;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
