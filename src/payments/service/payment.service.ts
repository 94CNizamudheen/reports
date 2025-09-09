
import { Injectable } from "@nestjs/common";
import { PaymentRepository } from "../repository/payments.repository"; 
import { Payment } from "../entities/payment.entity";

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  async findById(id: number): Promise<Payment> {
    return this.paymentRepository.findById(id);
  }

  async findByTicketId(ticketId: number): Promise<Payment[]> {
    return this.paymentRepository.findByTicketId(ticketId);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    return this.paymentRepository.findByDateRange(startDate, endDate);
  }

  async create(payment: Partial<Payment>): Promise<Payment> {
    return this.paymentRepository.create(payment);
  }

  async update(id: number, payment: Partial<Payment>): Promise<Payment> {
    return this.paymentRepository.update(id, payment);
  }

  async delete(id: number): Promise<void> {
    return this.paymentRepository.delete(id);
  }
}
