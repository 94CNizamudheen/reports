import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExportJob } from './export-jobs.entity';
import { Ticket } from '../sales/entities/ticket.entity';
import { Order } from '../sales/entities/order.entity';
import { Payment } from '../sales/entities/payment.entity';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ExportJob) private jobs: Repository<ExportJob>,
    @InjectRepository(Ticket) private tickets: Repository<Ticket>,
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(Payment) private payments: Repository<Payment>,
  ) {}

  async queueJob(tenant: string, type: string, params: any) {
    const job = await this.jobs.save(this.jobs.create({ tenant, type, params, status: 'queued' }));
    return { jobId: job.id, status: job.status };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async worker() {
    const job = await this.jobs.findOne({ where: { status: 'queued' }, order: { created_at: 'ASC' } });
    if (!job) return;

    job.status = 'running';
    await this.jobs.save(job);
    try {
      let filePath = '';
      if (job.type === 'daily-sales') filePath = await this.exportDailySales(job.params.date);
      job.status = 'done';
      job.filePath = filePath;
      await this.jobs.save(job);
    } catch (e: any) {
      job.status = 'error'; job.error = e?.message || 'unknown';
      await this.jobs.save(job);
    }
  }

  async exportDailySales(date: string) {
    // aggregate orders & payments for the day
    const orders = await this.orders.createQueryBuilder('o')
      .select([
        'o.product_name as product',
        'SUM(o.quantity) as qty',
        'SUM(o.order_amount::numeric) as gross',
        'SUM(o.tax_amount::numeric) as tax',
        'SUM(o.net_amount::numeric) as net',
      ])
      .where('o.business_date = :d', { d: date })
      .groupBy('o.product_name')
      .orderBy('gross', 'DESC')
      .getRawMany();

    const payments = await this.payments.createQueryBuilder('p')
      .select(['p.payment_type as type', 'SUM(p.payment_amount::numeric) as total'])
      .where('p.payment_date = :d', { d: date })
      .groupBy('p.payment_type')
      .orderBy('total', 'DESC')
      .getRawMany();

    const wb = new ExcelJS.Workbook();
    const s1 = wb.addWorksheet('Sales by Product');
    s1.addRow(['Product', 'Qty', 'Gross', 'Tax', 'Net']);
    orders.forEach(r => s1.addRow([r.product, +r.qty, +r.gross, +r.tax, +r.net]));
    const s2 = wb.addWorksheet('Payments');
    s2.addRow(['Type', 'Total']);
    payments.forEach(r => s2.addRow([r.type, +r.total]));

    const outDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    const file = path.join(outDir, `daily-${date}.xlsx`);
    await wb.xlsx.writeFile(file);
    return file;
  }

  async getFile(id: number) {
    const job = await this.jobs.findOne({ where: { id } });
    if (!job || job.status !== 'done' || !job.filePath) throw new NotFoundException('Report not ready');
    return job.filePath;
  }
}
