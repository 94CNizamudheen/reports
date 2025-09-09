import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { Order } from "../entities/order.entity";

@Injectable()
export class OrderRepository {
    constructor(
        @InjectRepository(Order)
        private readonly repository: Repository<Order>,
    ) { }

    async findAll(): Promise<Order[]> {
        return this.repository.find({ relations: ["ticket"] });
    }

    async findById(id: number): Promise<Order> {
        const order = await this.repository.findOne({ where: { id }, relations: ["ticket"] });
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }

    async findByTicketId(ticketId: number): Promise<Order[]> {
        return this.repository.find({
            where: { ticket: { id: ticketId } },
            relations: ["ticket"],
        });
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
        return this.repository.find({
            where: { created_at: Between(startDate, endDate) },
            relations: ["ticket"],
        });
    }

    async create(order: Partial<Order>): Promise<Order> {
        const newOrder = this.repository.create(order);
        return this.repository.save(newOrder);
    }

    async update(id: number, order: Partial<Order>): Promise<Order> {
        await this.repository.update(id, order);
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
