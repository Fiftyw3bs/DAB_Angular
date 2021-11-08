import { IProduct } from './../../admin/models/product.d';

export interface IOrder {
  id?: string;
  product: IProduct;
  quantity: number;
  dateCompleted?: string;
  dateCreated?: any;
  orderer?: string;
  costPerUnit: number;
  unit: string;
  sellType: boolean,
  selfDelivery: boolean,
  shipCost: number,
  expectedDate: Date,
  deliveryDate?: Date,
  status?: 'ACCEPTED' | 'PENDING' | 'CANCELLED';
  bids?: number;
  bidder?: string;
  tt?: any
}