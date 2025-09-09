import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { PaymentRepository } from "./repository/payments.repository";
import { PaymentService } from "./service/payment.service";
import { PaymentController } from "./payment.controller";


@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentRepository, PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentsModule {}
