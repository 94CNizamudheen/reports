
export enum OrderItemType {
  PRODUCT = "Product",
  TAG = "Tag",
  COMBO_ITEM = "ComboItem",
}

export interface TaxDetail {
  GST?: number;
  VAT?: number;
  [key: string]: number | undefined;
}

export interface ChargeDetail {
  service_charge?: number;
  packing_fee?: number;
  discount?: number;
  promotion?: number;
}

export interface OrderState {
  gift?: boolean;
  void?: boolean;
  comp?: boolean;
  return?: boolean;
  refund?: boolean;
  submitted?: boolean;
}

export interface OrderPromotion {
  id: number;
}

export interface Upselling {
  id: number;
}

export interface OrderChannelUser {
  created_by: string;
}

export interface OrderExt {
  note?: string;
}


export enum TicketStateType {
  COMPLETED = "completed",
  VOID = "void",
  REFUND = "refund",
  RETURN = "return",
}

export interface TicketState {
  completed?: boolean;
  void?: boolean;
  refund?: boolean;
  return?: boolean;
}

export interface Promotion {
  included: boolean;
  id: number;
  amount: number;
}

export interface Delivery {
  id: number;
  pos_sync: boolean;
}

export interface ChannelUser {
  created_by: string;
  updated_by?: string;
}

export interface Ext {
  note?: string;
}

export interface ExternalSync {
  [key: string]: any;
}


export const numericTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => (value ? Number.parseFloat(value) : null),
};
