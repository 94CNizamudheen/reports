import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenent.entity';
import { ApiKey } from './entities/api-key.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, ApiKey])],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [TypeOrmModule, AuthRepository],
})
export class AuthModule {}
