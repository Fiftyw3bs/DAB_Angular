import { IOrder } from './order.d';
export interface IOrderBid {
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

export type Status = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PICKED UP' | 'CANCELLED' | 'AWAITING PICKUP' | 'AWAITING DELIVERY' | 'DELIVERED' | 'COMPLETED';