import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { TransactionRepository } from "./repository/transaction.repository"; 
import { TransactionService } from "./service/transaction.service";
import { TransactionController } from "./transaction.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionRepository, TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
