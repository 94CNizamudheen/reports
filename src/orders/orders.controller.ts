import {  Controller,  Get,  Post,  Put,  Delete,  Param,  Body,  Query,} from "@nestjs/common";
import { OrderService } from "./service/orders.service";
import { Order } from "./entities/order.entity";
import { CreateOrderDto } from "./dtos/create-order.dto"; 
import { UpdateOrderDto } from "./dtos/update-order.dto"; 

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get("ticket/:ticketId")
  async findByTicketId(@Param("ticketId") ticketId: number): Promise<Order[]> {
    return this.orderService.findByTicketId(ticketId);
  }

  @Get("date-range")
  async findByDateRange(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
  ): Promise<Order[]> {
    return this.orderService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(":id")
  async findById(@Param("id") id: number): Promise<Order> {
    return this.orderService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(dto);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() dto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.update(id, dto);
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<{ deleted: boolean }> {
    await this.orderService.delete(id);
    return { deleted: true };
  }
}
