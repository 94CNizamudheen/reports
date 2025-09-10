import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
let faker: typeof import('@faker-js/faker').faker;


import { Location } from '../catalog/entities/location.entity';
import { PaymentType } from '../catalog/entities/payment-type.entity';
import { TransactionType } from '../catalog/entities/transaction-type.entity';
import { Product } from '../catalog/entities/product.entity';
import { Ticket } from '../sales/entities/ticket.entity';
import { TicketLog } from '../sales/entities/ticket-log.entity';
import { Order } from '../sales/entities/order.entity';
import { Payment } from '../sales/entities/payment.entity';
import { Trx } from '../sales/entities/transaction.entity';
import { OrderItemType } from 'src/types';

@Injectable()
export class SeederService {
    private readonly log = new Logger(SeederService.name);

    constructor(
        @InjectRepository(Location) private locations: Repository<Location>,
        @InjectRepository(PaymentType) private payTypes: Repository<PaymentType>,
        @InjectRepository(TransactionType) private trxTypes: Repository<TransactionType>,
        @InjectRepository(Product) private products: Repository<Product>,
        @InjectRepository(Ticket) private tickets: Repository<Ticket>,
        @InjectRepository(TicketLog) private logsRepo: Repository<TicketLog>,
        @InjectRepository(Order) private orders: Repository<Order>,
        @InjectRepository(Payment) private payments: Repository<Payment>,
        @InjectRepository(Trx) private trxs: Repository<Trx>,
    ) { }
    async onModuleInit() {
        const f = await import('@faker-js/faker');
        faker = f.faker;
    }

    async seedCatalog({
        locations = 100,
        paymentTypes = 20,
        transactionTypes = 20,
        products = 1000,
    } = {}) {


        if ((await this.locations.count()) < locations) {
            await this.locations.save(Array.from({ length: locations }, (_, i) => this.locations.create({ name: `Location ${i + 1}` })));
        }
        // Payment Types

        if ((await this.payTypes.count()) < paymentTypes) {
            await this.payTypes.save(Array.from({ length: paymentTypes }, (_, i) => this.payTypes.create({ name: `PT-${i + 1}` })));
        }
        // Transaction Types (ensure Sales & Payment exist)
        const must = ['Sales', 'Payment'];
        const existing = await this.trxTypes.find();
        const missing = must.filter(m => !existing.some(e => e.name === m));
        if (missing.length) await this.trxTypes.save(missing.map(name => this.trxTypes.create({ name })));
        if ((await this.trxTypes.count()) < transactionTypes) {
            const toAdd = transactionTypes - (await this.trxTypes.count());
            await this.trxTypes.save(Array.from({ length: toAdd }, (_, i) => this.trxTypes.create({ name: `TRX-${i + 1}` })));
        }

        // Products
        if ((await this.products.count()) < products) {
            const batch = 100;
            for (let i = 0; i < products; i += batch) {
                const items = Array.from({ length: Math.min(batch, products - i) }).map(() => this.products.create({
                    name: faker.commerce.productName(),
                    price: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }).toFixed(2),
                    isActive: true,
                }));
                await this.products.save(items);
            }
        }
        return { ok: true };
    }


    async seedTickets(params?: { startDate?: string; endDate?: string; totalTickets?: number }) {
        const {
            startDate = '2023-01-01',
            endDate = dayjs().format('YYYY-MM-DD'),
            totalTickets = 4000,
        } = params || {};

        const locs = await this.locations.find();
        const prods = await this.products.find();
        const paytypes = await this.payTypes.find();

        if (!locs.length || !prods.length || !paytypes.length) {
            throw new Error('Seed catalog first');
        }

        const start = dayjs(startDate);
        const end = dayjs(endDate);
        const days = end.diff(start, 'day') + 1;

        this.log.log(`Seeding ${totalTickets} tickets between ${startDate} and ${endDate} (${days} days)`);

        const existingTickets = await this.tickets
            .createQueryBuilder('t')
            .select('t.location_id', 'location_id')
            .addSelect('MAX(t.ticket_number)', 'last_ticket_number')
            .groupBy('t.location_id')
            .getRawMany();

        const lastTicketNumberMap: Record<number, number> = {}; 
        for (const row of existingTickets) {
            lastTicketNumberMap[row.location_id] = Number(row.last_ticket_number);
        }

        const ticketsPerDayMap: Record<string, number> = {};
        for (let i = 0; i < totalTickets; i++) {
            const randDay = start.add(Math.floor(Math.random() * days), 'day').format('YYYY-MM-DD');
            ticketsPerDayMap[randDay] = (ticketsPerDayMap[randDay] || 0) + 1;
        }

        const BATCH = 500;
        for (const [bizDate, count] of Object.entries(ticketsPerDayMap)) {
            this.log.log(` → ${count} tickets on ${bizDate}`);

            for (let offset = 0; offset < count; offset += BATCH) {
                const sliceCount = Math.min(BATCH, count - offset);

                const tickets: Ticket[] = [];
                const orders: Order[] = [];
                const payments: Payment[] = [];
                const trxs: Trx[] = [];
                const logs: TicketLog[] = [];

                for (let i = 0; i < sliceCount; i++) {
                    const location = faker.helpers.arrayElement(locs).id;
                    const lastNumber = lastTicketNumberMap[location] || 0;

                    const created = dayjs(bizDate)
                        .hour(faker.number.int({ min: 9, max: 21 }))
                        .minute(faker.number.int({ min: 0, max: 59 }))
                        .toDate();

                    const ticket = this.tickets.create({
                        channel_name: 'POS',
                        ticket_id: randomUUID(),
                        ticket_number: lastNumber + 1,
                        queue_number: lastNumber + 1,
                        location_id: location,
                        sale_location_id: location,
                        invoice_no: faker.string.alphanumeric(10).toUpperCase(),
                        refund: false,
                        ticket_amount: 0,
                        tax_inclusive: true,
                        ordermode_name: 'Dine-In',
                        tags: { source: 'seed' },
                        ticket_state: { completed: true, void: false, refund: false, return: false },
                        terminal: 'T1',
                        channel_user: { created_by: 'seed', updated_by: 'seed' },
                        ext: { note: '' },
                        external_sync: null,
                        business_date: bizDate,
                        ticket_created_time: created,
                        ticket_updated_time: created,
                        last_order_time: created,
                        last_payment_date: bizDate,
                        last_payment_time: created,
                    });
                    tickets.push(ticket);
                    lastTicketNumberMap[location] = lastNumber + 1;
                }

                const savedTickets = await this.tickets.save(tickets);

                for (const t of savedTickets) {
                    let gross = 0;
                    const orderCount = faker.number.int({ min: 2, max: 5 });

                    for (let j = 0; j < orderCount; j++) {
                        const prod = faker.helpers.arrayElement(prods);
                        const qty = faker.number.int({ min: 1, max: 3 });
                        const amount = +(Number(prod.price) * qty).toFixed(2);
                        const tax = +(amount * 0.06).toFixed(2);
                        const net = +(amount - tax).toFixed(2);
                        gross += amount;

                        orders.push(this.orders.create({
                            ticket: t,
                            order_id: randomUUID(),
                            location_id: t.location_id,
                            department_name: 'Kitchen',
                            order_item_type: OrderItemType.PRODUCT,
                            product_name: prod.name,
                            quantity: qty,
                            order_amount: amount,
                            tax_inclusive: true,
                            tax_amount: tax,
                            tax_detail: { GST: tax },
                            net_amount: net,
                            charge_amount: 0,
                            charge_detail: {},
                            order_state: { submitted: true },
                            business_date: t.business_date,
                            order_date: t.business_date,
                            order_time: t.ticket_created_time,
                        }));
                    }

                    const pType = faker.helpers.arrayElement(paytypes).name;
                    payments.push(this.payments.create({
                        ticket: t,
                        payment_id: randomUUID(),
                        payment_type: pType,
                        payment_amount: gross.toFixed(2),
                        net_amount: gross.toFixed(2),
                        currency: 'MYR',
                        payment_date: t.business_date,
                        payment_time: t.last_payment_time,
                    }));

                    trxs.push(this.trxs.create({ ticket: t, transactionTypeName: 'Sales', amount: gross.toFixed(2), transactionTime: t.ticket_created_time }));
                    trxs.push(this.trxs.create({ ticket: t, transactionTypeName: 'Payment', amount: (-gross).toFixed(2), transactionTime: t.last_payment_time }));
                    trxs.push(this.trxs.create({ ticket: t, transactionTypeName: 'Sales', amount: '0.00', transactionTime: t.last_payment_time }));

                    logs.push(this.logsRepo.create({ ticket: t, logs: [{ at: new Date().toISOString(), msg: 'Ticket created (seed)' }] }));

                    t.ticket_amount = Number(gross.toFixed(2));
                }

                await this.orders.save(orders);
                await this.payments.save(payments);
                await this.trxs.save(trxs);
                await this.logsRepo.save(logs);
                await this.tickets.save(savedTickets);
            }
        }

        return { ok: true, totalTickets };
    }



}
