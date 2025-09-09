
import { Controller, Get, Post, Body, Param, Delete, Put, Query, } from '@nestjs/common';
import { TicketsService } from './service/ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    create(@Body() dto: CreateTicketDto) {
        return this.ticketsService.create(dto);
    }

    @Get()
    findAll() {
        return this.ticketsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
        return this.ticketsService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.ticketsService.remove(+id);
    }

    @Get('report/filter')
    getReport(
        @Query('from') from: string,
        @Query('to') to: string,
        @Query('locationId') locationId?: string,
        @Query('department') department?: string,
    ) {
        return this.ticketsService.getReport(
            new Date(from),
            new Date(to),
            locationId ? Number(locationId) : undefined,
            department,
        );
    }
}
