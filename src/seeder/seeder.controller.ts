

import { Controller, Logger, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seed')
export class SeederController {
  private readonly logger= new Logger()
  constructor(private readonly seeder: SeederService) {}

  @Post('catalog')
  async catalog() {
    this.logger.debug('hitted')
    return this.seeder.seedCatalog();
  }

  @Post('tickets')
  async tickets() {
    return this.seeder.seedTickets();
  }
}
