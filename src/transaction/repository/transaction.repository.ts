
import { Injectable } from "@nestjs/common";
import { Repository, Between } from "typeorm";
import { Transaction } from "../entities/transaction.entity";

@Injectable()
export class TransactionRepository {
    constructor(private readonly repository: Repository<Transaction>) { }

    async findAll(): Promise<Transaction[]> {
        return this.repository.find({ relations: ["ticket"] });
    }

    async findById(id: number): Promise<Transaction | null> {
        return this.repository.findOne({ where: { id }, relations: ["ticket"] });
    }

    async findByTicketId(ticketId: number): Promise<Transaction[]> {
        return this.repository.find({
            where: { ticket: { id: ticketId } },
            relations: ["ticket"],
        });
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
        return this.repository.find({
            where: { transaction_time: Between(startDate, endDate) },
            relations: ["ticket"],
        });
    }

    async create(transaction: Partial<Transaction>): Promise<Transaction> {
        const newTx = this.repository.create(transaction);
        return this.repository.save(newTx);
    }

    async update(id: number, transaction: Partial<Transaction>): Promise<Transaction | null> {
        await this.repository.update(id, transaction);
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
