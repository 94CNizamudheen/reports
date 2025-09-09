import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Location } from '../catalog/entities/location.entity';
import { PaymentType } from '../catalog/entities/payment-type.entity';
import { TransactionType } from '../catalog/entities/transaction-type.entity';
import { Product } from '../catalog/entities/product.entity';
import { Ticket } from '../sales/entities/ticket.entity';
import { TicketLog } from '../sales/entities/ticket-log.entity';
import { Order } from '../sales/entities/order.entity';
import { Payment } from '../sales/entities/payment.entity';
import { Trx } from '../sales/entities/transaction.entity';
import { SeederController } from './seeder.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    Location, PaymentType, TransactionType, Product,
    Ticket, TicketLog, Order, Payment, Trx
  ])],
  providers: [SeederService],
  exports: [SeederService],
  controllers:[SeederController]
})
export class SeederModule {}
