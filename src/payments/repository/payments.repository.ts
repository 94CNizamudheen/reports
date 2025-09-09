
import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, Between } from "typeorm";
import { Payment } from "../entities/payment.entity";

@Injectable()
export class PaymentRepository {
  constructor(private readonly repository: Repository<Payment>) {}

  async findAll(): Promise<Payment[]> {
    return this.repository.find({ relations: ["ticket"] });
  }

  async findById(id: number): Promise<Payment> {
    const payment = await this.repository.findOne({ where: { id }, relations: ["ticket"] });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findByTicketId(ticketId: number): Promise<Payment[]> {
    return this.repository.find({
      where: { ticket: { id: ticketId } },
      relations: ["ticket"],
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    return this.repository.find({
      where: { created_at: Between(startDate, endDate) },
      relations: ["ticket"],
    });
  }

  async create(payment: Partial<Payment>): Promise<Payment> {
    const newPayment = this.repository.create(payment);
    return this.repository.save(newPayment);
  }

  async update(id: number, payment: Partial<Payment>): Promise<Payment> {
    await this.repository.update(id, payment);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
