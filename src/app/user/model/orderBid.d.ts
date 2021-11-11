import { IOrder } from './order.d';
export interface IBid {
  id?: string;
  bidder: string;
  biddingPrice: number;
  bidQuantity: number;
  bidDate: any;
  status: Status;
  order?: IOrder;
  sellType: boolean;
  selfDelivery: boolean;
  shipCost: number;
  expectedDate: Date;
  deliveryDate?: Date;
  orderBidTT?: any;
  maxReactionTime: Date
}

export type Status = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PICKED_UP';