

import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Location } from '../catalog/entities/location.entity';
import { PaymentType } from '../catalog/entities/payment-type.entity';
import { TransactionType } from '../catalog/entities/transaction-type.entity';
import { Product } from '../catalog/entities/product.entity';
import { Ticket } from '../sales/entities/ticket.entity';
import { TicketLog } from '../sales/entities/ticket-log.entity';
import { Order } from '../sales/entities/order.entity';
import { Payment } from '../sales/entities/payment.entity';
import { Trx } from '../sales/entities/transaction.entity';
import { ExportJob } from '../reports/export-jobs.entity';
import { Tenant } from 'src/auth/entities/tenent.entity';
import { ApiKey } from 'src/auth/entities/api-key.entity';

export const typeOrmFactory = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: config.getOrThrow<string>('DB_URL'),
  ssl: true,
  entities: [
    Location, PaymentType, TransactionType, Product,
    Ticket, TicketLog, Order, Payment, Trx,
    ExportJob,Tenant,ApiKey
    
  ],
  synchronize: true,
  logging: false,
});
