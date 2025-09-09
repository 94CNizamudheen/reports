import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  channel_name: string;

  @IsUUID()
  ticket_id: string;

  @IsInt()
  ticket_number: number;

  @IsInt()
  location_id: number;

  @IsInt()
  sale_location_id: number;

  @IsOptional()
  @IsString()
  invoice_no?: string;

  @IsBoolean()
  refund: boolean;

  @IsNumber()
  ticket_amount: number;

  @IsBoolean()
  tax_inclusive: boolean;

  @IsOptional()
  @IsString()
  department_name?: string;

  @IsOptional()
  tags?: any;

  @IsOptional()
  ticket_state?: any;

  @IsBoolean()
  pre_order: boolean;

  @IsOptional()
  @IsInt()
  work_period_id?: number;

  @IsOptional()
  promotion?: any;

  @IsOptional()
  delivery?: any;

  @IsOptional()
  @IsString()
  terminal?: string;

  @IsOptional()
  @IsInt()
  queue_number?: number;

  @IsOptional()
  channel_user?: any;

  @IsOptional()
  ext?: any;

  @IsOptional()
  external_sync?: any;

  @IsOptional()
  @IsDateString()
  business_date?: Date;

  @IsOptional()
  @IsDateString()
  ticket_created_time?: Date;

  @IsOptional()
  @IsDateString()
  ticket_updated_time?: Date;

  @IsOptional()
  @IsDateString()
  last_order_time?: Date;

  @IsOptional()
  @IsDateString()
  last_payment_date?: Date;

  @IsOptional()
  @IsDateString()
  last_payment_time?: Date;

  @IsOptional()
  @IsDateString()
  delivery_date?: Date;

  @IsOptional()
  @IsDateString()
  delivery_time?: Date;
}
