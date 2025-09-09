import { Injectable } from "@nestjs/common";
import { OrderRepository } from "../repositories/order.repository";
import { Order } from "../entities/order.entity";
import { CreateOrderDto } from "../dtos/create-order.dto"; 
import { UpdateOrderDto } from "../dtos/update-order.dto"; 

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async findById(id: number): Promise<Order> {
    return this.orderRepository.findById(id);
  }

  async findByTicketId(ticketId: number): Promise<Order[]> {
    return this.orderRepository.findByTicketId(ticketId);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return this.orderRepository.findByDateRange(startDate, endDate);
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    return this.orderRepository.create(dto);
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    return this.orderRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    return this.orderRepository.delete(id);
  }
}
