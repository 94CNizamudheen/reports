import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmFactory } from './config/typeorm.config';
import { ScheduleModule } from '@nestjs/schedule';

import { ReportsModule } from './reports/reports.module';
import { SeederModule } from './seeder/seeder.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmFactory,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    ReportsModule,
    SeederModule,
  ],
})
export class AppModule { }
