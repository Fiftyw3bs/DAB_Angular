import { IOrder } from './order.d';
export interface IBid {
  id?: string;
  bidder: string;
  biddingPrice: number;
  bidQuantity: number;
  bidDate: any;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  order?: IOrder;
}
