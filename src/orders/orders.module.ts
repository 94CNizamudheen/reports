import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { OrderRepository } from "./repositories/order.repository";
import { OrderService } from "./service/orders.service";
import { OrderController } from "./orders.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderRepository, OrderService],
  controllers: [OrderController],
  exports: [OrderService, OrderRepository],
})
export class OrdersModule {}
