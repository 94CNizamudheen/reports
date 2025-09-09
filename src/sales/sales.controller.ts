import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { SalesService } from './sales.service';
import { TenantInterceptor } from 'src/common/interceptors/tenant.interceptor';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';


@Controller('tickets')
@UseInterceptors(TenantInterceptor)
@UseGuards(ApiKeyGuard)
export class SalesController {
  constructor(private readonly svc: SalesService) {}

  @Get('summary')
  dailySummary(@Query('date') date: string) {
    return this.svc.getDailySummary(date);
  }
}