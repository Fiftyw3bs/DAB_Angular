import { IProduct } from './../../admin/models/product.d';

export class SalesType {
  sellType: boolean;
  selfDelivery: boolean;
  shipCost: number;
  expectedDate: string;
  deliveryDate?: string;
}

export interface IOrder {
  id?: string;
  product: IProduct;
  quantity: number;
  dateCompleted?: string;
  dateCreated?: any;
  orderer?: string;
  salesType: SalesType;
  status?: 'ACCEPTED' | 'PENDING' | 'CANCELLED';
  bids?: number;
  bidder?: string;
}