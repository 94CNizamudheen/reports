import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExportJob } from './export-jobs.entity';
import { Ticket } from '../sales/entities/ticket.entity';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(ExportJob) private jobs: Repository<ExportJob>,
    @InjectRepository(Ticket) private tickets: Repository<Ticket>,

  ) { }

  async queueJob(tenant: string, type: string, params: any) {

    const job = await this.jobs.save(
      this.jobs.create({ tenant, type, params, status: 'running' }),
    );

    try {
      const parsedParams =  typeof job.params === 'string' ? JSON.parse(job.params) : job.params;
      let filePath = '';
      if (job.type === 'daily-sales') {
        this.logger.log(
          `Processing daily-sales job ${job.id} for date=${parsedParams.date}`,
        );
        filePath = await this.exportDailySales(parsedParams.date);
      }

      job.status = 'done';
      job.filePath = filePath;
      await this.jobs.save(job);

      return { jobId: job.id, status: job.status, filePath };
    } catch (e: any) {
      this.logger.error(`Job ${job.id} failed`, e.stack);
      job.status = 'error';
      job.error = e?.message || 'unknown';
      await this.jobs.save(job);
      throw new Error(`Export failed: ${job.error}`);
    }
  }


  async exportDailySales(date: string) {
    const tickets = await this.tickets.find({
      where: { business_date: date },
      relations: ['orders', 'payments', 'transactions'],
    });

    const orders = tickets.flatMap(t => (t.orders || []).map(o => ({ ...o, ticketId: t.id })),);
    const payments = tickets.flatMap(t => (t.payments || []).map(p => ({ ...p, ticketId: t.id })),);
    const transactions = tickets.flatMap(t => (t.transactions || []).map(tr => ({ ...tr, ticketId: t.id })),);
    this.logger.debug(`orders ${JSON.stringify(orders)}`)
    this.logger.debug(`payments ${JSON.stringify(payments)}`)
    this.logger.debug(`transactions ${JSON.stringify(transactions)}`)

    const wb = new ExcelJS.Workbook();

    // Tickets sheet
    const s1 = wb.addWorksheet('Tickets');
    s1.addRow([
      'Id',
      'TicketNumber',
      'LocationId',
      'Creattion Time',
      'LastOrderTime',
      'LastPaymentTime',
      'TicketAmount',
      'Departmet Name',
    ]);
    s1.getRow(1).font = { bold: true };

    tickets.forEach((t) => {
      s1.addRow([
        t.id,
        t.ticket_number,
        t.location_id,
        t.ticket_created_time,
        t.last_order_time,
        t.last_payment_time,
        Number(t.ticket_amount),
        t.ordermode_name,
      ]);
    });

    // Orders sheet
    const s2 = wb.addWorksheet('Orders');
    s2.addRow([
      'Id',
      'Menu Item Name',
      'Quantity',
      'Price',
      'Creation Time',
      'OrderNumber',
      'LocationId',
      'TicketId',
    ]);
    s2.getRow(1).font = { bold: true };

    orders.forEach((o) => {
      const unitPrice =
        o.quantity && o.quantity > 0
          ? Number(o.order_amount) / o.quantity
          : Number(o.order_amount);

      s2.addRow([
        o.id,
        o.product_name,
        o.quantity,
        unitPrice,
        o.created_at,
        o.order_id,
        o.location_id,
        o.ticketId,
      ]);
    });

    // Payments sheet
    const s3 = wb.addWorksheet('Payments');
    s3.addRow(['Id', 'Name', 'Amount', 'PaymentCreatedTime', 'TicketId']);
    s3.getRow(1).font = { bold: true };

    payments.forEach((p) => {
      s3.addRow([
        p.id,
        p.payment_type,
        Number(p.payment_amount),
        p.created_at,
        p.ticketId,
      ]);
    });

    // Transactions sheet
    const s4 = wb.addWorksheet('Transactions');
    s4.addRow(['Id', 'Name', 'Amount', 'CreationTime', 'TicketId']);
    s4.getRow(1).font = { bold: true };

    transactions.forEach((tr) => {
      s4.addRow([
        tr.id,
        tr.transactionTypeName,
        Number(tr.amount),
        tr.created_at,
        tr.ticketId,
      ]);
    });

    // Autosize columns
    [s1, s2, s3, s4].forEach((sheet) => {
      sheet.columns.forEach((col) => {
        if (!col) return;
        let maxLength = 15;
        col.eachCell!({ includeEmpty: true }, (cell) => {
          const val = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, val.length);
        });
        col.width = maxLength + 2;
      });
    });

    const outDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    const file = path.join(outDir, `daily-${date}.xlsx`);
    await wb.xlsx.writeFile(file);
    return file;
  }

  async getFile(id: number) {
    const job = await this.jobs.findOne({ where: { id } });
    if (!job || job.status !== 'done' || !job.filePath) {
      throw new NotFoundException('Report not ready');
    }
    return job.filePath;
  }
}
