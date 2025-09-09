import { Body, Controller, Get, Param, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportsService } from './reports.service'; 
import type { Response } from 'express';
import { TenantInterceptor } from 'src/common/interceptors/tenant.interceptor';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Controller('reports')
@UseInterceptors(TenantInterceptor)
@UseGuards(ApiKeyGuard)
export class ReportsController {
  constructor(private readonly svc: ReportsService) {}

  @Post('export/daily-sales')
  queueDaily(@Body() body: { date: string }, req: any) {
    return this.svc.queueJob(req.requestedTenantName, 'daily-sales', { date: body.date });
  }

  @Get('export/:id')
  async download(@Param('id') id: number, @Res() res: Response) {
    const file = await this.svc.getFile(+id);
    res.download(file, `report-${id}.xlsx`);
  }
};

