import { Controller, Get, Post, Put, Delete, Param, Body, Query, } from "@nestjs/common";
import { TransactionService } from "./service/transaction.service";
import { Transaction } from "./entities/transaction.entity";

@Controller("transactions")
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Get()
    async findAll(): Promise<Transaction[]> {
        return this.transactionService.findAll();
    }

    @Get(":id")
    async findById(@Param("id") id: number): Promise<Transaction | null> {
        return this.transactionService.findById(id);
    }

    @Get("ticket/:ticketId")
    async findByTicketId(
        @Param("ticketId") ticketId: number,
    ): Promise<Transaction[]> {
        return this.transactionService.findByTicketId(ticketId);
    }

    @Get("date-range")
    async findByDateRange(
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string,
    ): Promise<Transaction[]> {
        return this.transactionService.findByDateRange(
            new Date(startDate),
            new Date(endDate),
        );
    }

    @Post()
    async create(@Body() transaction: Partial<Transaction>): Promise<Transaction> {
        return this.transactionService.create(transaction);
    }

    @Put(":id")
    async update(
        @Param("id") id: number,
        @Body() transaction: Partial<Transaction>,
    ): Promise<Transaction | null> {
        return this.transactionService.update(id, transaction);
    }

    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        return this.transactionService.delete(id);
    }
}
