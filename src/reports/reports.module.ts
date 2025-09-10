import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportJob } from './export-jobs.entity';

import { Ticket } from '../sales/entities/ticket.entity';
import { Order } from '../sales/entities/order.entity';
import { Payment } from '../sales/entities/payment.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { AuthModule } from 'src/auth/auth.module';
import { ReportsRepository } from './report.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ExportJob, Ticket, Order, Payment]),AuthModule],
  controllers: [ReportsController],
  providers: [ReportsService,ReportsRepository],
})
export class ReportsModule {}
