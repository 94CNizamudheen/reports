import {
  IsUUID,
  IsInt,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
} from "class-validator";
import { OrderItemType } from "../entities/order.entity";

export class CreateOrderDto {
  @IsUUID()
  order_id: string;

  @IsInt()
  location_id: number;

  @IsOptional()
  @IsString()
  department_name?: string;

  @IsEnum(OrderItemType)
  order_item_type: OrderItemType;

  @IsOptional()
  @IsString()
  product_name?: string;

  @IsOptional()
  @IsString()
  tag_name?: string;

  @IsOptional()
  @IsString()
  combo_item_name?: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  order_amount: number;

  @IsBoolean()
  tax_inclusive: boolean;

  @IsOptional()
  @IsNumber()
  tax_amount?: number;

  @IsNumber()
  net_amount: number;

  @IsOptional()
  @IsNumber()
  charge_amount?: number;
}
