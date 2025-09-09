import { Controller, Get, Post, Put, Delete, Param, Body, Query } from "@nestjs/common";
import { PaymentService } from "./service/payment.service"; 
import { Payment } from "./entities/payment.entity";

@Controller("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get("ticket/:ticketId")
  async findByTicketId(@Param("ticketId") ticketId: number): Promise<Payment[]> {
    return this.paymentService.findByTicketId(ticketId);
  }

  @Get("date-range")
  async findByDateRange(@Query("startDate") startDate: string, @Query("endDate") endDate: string): Promise<Payment[]> {
    return this.paymentService.findByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get(":id")
  async findById(@Param("id") id: number): Promise<Payment> {
    return this.paymentService.findById(id);
  }

  @Post()
  async create(@Body() payment: Partial<Payment>): Promise<Payment> {
    return this.paymentService.create(payment);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() payment: Partial<Payment>): Promise<Payment> {
    return this.paymentService.update(id, payment);
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<void> {
    return this.paymentService.delete(id);
  }
}
