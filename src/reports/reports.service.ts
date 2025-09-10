import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ReportsRepository } from './report.repository';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly repo: ReportsRepository) { }

  async generateDailySalesReport(date: string): Promise<Buffer> {
    const tickets = await this.repo.findTicketsByDate(date);

    const orders = tickets.flatMap(t =>
      (t.orders || []).map(o => ({ ...o, ticketId: t.id })),
    );
    const payments = tickets.flatMap(t =>
      (t.payments || []).map(p => ({ ...p, ticketId: t.id })),
    );
    const transactions = tickets.flatMap(t =>
      (t.transactions || []).map(tr => ({ ...tr, ticketId: t.id })),
    );

    const wb = new ExcelJS.Workbook();

    // Tickets sheet
    const s1 = wb.addWorksheet('Tickets');
    s1.addRow([
      'Id', 'TicketNumber', 'LocationId', 'Creation Time',
      'LastOrderTime', 'LastPaymentTime', 'TicketAmount', 'Department Name',
    ]);
    s1.getRow(1).font = { bold: true };
    tickets.forEach(t => {
      s1.addRow([
        t.id, t.ticket_number, t.location_id, t.ticket_created_time,
        t.last_order_time, t.last_payment_time, Number(t.ticket_amount),
        t.ordermode_name,
      ]);
    });

    // Orders sheet
    const s2 = wb.addWorksheet('Orders');
    s2.addRow([
      'Id', 'Menu Item Name', 'Quantity', 'Price',
      'Creation Time', 'OrderNumber', 'LocationId', 'TicketId',
    ]);
    s2.getRow(1).font = { bold: true };
    orders.forEach(o => {
      const unitPrice =
        o.quantity && o.quantity > 0
          ? Number(o.order_amount) / o.quantity
          : Number(o.order_amount);
      s2.addRow([
        o.id, o.product_name, o.quantity, unitPrice,
        o.created_at, o.order_id, o.location_id, o.ticketId,
      ]);
    });

    // Payments sheet
    const s3 = wb.addWorksheet('Payments');
    s3.addRow(['Id', 'Name', 'Amount', 'PaymentCreatedTime', 'TicketId']);
    s3.getRow(1).font = { bold: true };
    payments.forEach(p => {
      s3.addRow([
        p.id, p.payment_type, Number(p.payment_amount),
        p.created_at, p.ticketId,
      ]);
    });

    // Transactions sheet
    const s4 = wb.addWorksheet('Transactions');
    s4.addRow(['Id', 'Name', 'Amount', 'CreationTime', 'TicketId']);
    s4.getRow(1).font = { bold: true };
    transactions.forEach(tr => {
      s4.addRow([
        tr.id, tr.transactionTypeName, Number(tr.amount),
        tr.created_at, tr.ticketId,
      ]);
    });

    // Autosize columns
    [s1, s2, s3, s4].forEach(sheet => {
      sheet.columns.forEach(col => {
        if (!col) return;
        let maxLength = 15;
        col.eachCell!({ includeEmpty: true }, (cell) => {
          const val = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, val.length);
        });
        col.width = maxLength + 2;
      });
    });


    const data = await wb.xlsx.writeBuffer();
    return Buffer.from(data);
  }
}
