import { IProduct } from './../../admin/models/product.d';
export interface IOrder {
  id?: string;
  product: IProduct;
  quantity: number;
  dateCompleted?: string;
  dateCreated?: any;
  orderer?: string;
  status?: 'ACCEPTED' | 'PENDING' | 'CANCELLED';
  bids?: number;
  bidder?: string;
}
