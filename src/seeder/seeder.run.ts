import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from './seeder.service';
import dayjs from 'dayjs';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(SeederService);

  console.log('Starting seeder..');

  await seeder.seedCatalog({
    locations: 100,
    paymentTypes: 20,
    transactionTypes: 20,
    products: 1000,
  });
  console.log(' Catalog seeded');


  const startDate = dayjs().subtract(3, 'year').format('YYYY-MM-DD');
  const endDate = dayjs().format('YYYY-MM-DD');

  await seeder.seedTickets({
    startDate,
    endDate,
    totalTickets: 4000,
  });

  console.log(`tickets seeded between ${startDate} and ${endDate}`);

  await app.close();
  process.exit(0);
})();
