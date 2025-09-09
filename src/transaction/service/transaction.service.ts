import { Injectable } from "@nestjs/common";
import { TransactionRepository } from "../repository/transaction.repository";
import { Transaction } from "../entities/transaction.entity";

@Injectable()
export class TransactionService {
    constructor(private readonly transactionRepository: TransactionRepository) { }

    async findAll(): Promise<Transaction[]> {
        return this.transactionRepository.findAll();
    }

    async findById(id: number): Promise<Transaction | null> {
        return this.transactionRepository.findById(id);
    }

    async findByTicketId(ticketId: number): Promise<Transaction[]> {
        return this.transactionRepository.findByTicketId(ticketId);
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
        return this.transactionRepository.findByDateRange(startDate, endDate);
    }

    async create(transaction: Partial<Transaction>): Promise<Transaction> {
        return this.transactionRepository.create(transaction);
    }

    async update(id: number, transaction: Partial<Transaction>): Promise<Transaction | null> {
        return this.transactionRepository.update(id, transaction);
    }

    async delete(id: number): Promise<void> {
        return this.transactionRepository.delete(id);
    }
}
