import { Body, Controller, Logger, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { TenantInterceptor } from 'src/common/interceptors/tenant.interceptor';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Controller('reports')
@UseInterceptors(TenantInterceptor)
@UseGuards(ApiKeyGuard)
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);

  constructor(private readonly svc: ReportsService) {}

  @Post('export/daily-sales')
  async exportDaily(@Body() body: { date: string }, @Req() req: Request, @Res() res: Response) {
    this.logger.debug(`ExportDaily hit with date=${body.date}`);
    const buffer = await this.svc.generateDailySalesReport(body.date);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="daily-${body.date}.xlsx"`);
    res.end(buffer);
  }
}
