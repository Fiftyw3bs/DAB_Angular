import { IOrderBid } from './orderBid.d';
export interface IShipBid {
  id?: string;
  bidder: string;
  dateCreated: Date;
  status: SBStatus;
  shipQuantity: number;
  orderBid?: IOrderBid;
  shipCost: number;
  shipDate: Date;
  shipBidTT?: any;
  maxReactionTime: Date
}

export type SBStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PICKED UP' | 'CANCELLED' | 'DELIVERED' | 'COMPLETED';