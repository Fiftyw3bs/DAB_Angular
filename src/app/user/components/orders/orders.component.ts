import { IOrderBid } from './../../model/orderBid.d';
import { HelperService } from './../../../services/helper.service';
import { ProductService } from './../../../admin/services/product.service';
import { IProduct } from './../../../admin/models/product.d';
import { OrdersService } from './../../services/orders.service';
import { IOrder } from './../../model/order.d';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BidsService } from '../../services/bids.service';
import { BC_OrderService } from '../../services/blockchain/order.service';
import { BC_OrderBidService } from '../../services/blockchain/orderbid.service';
declare var jQuery: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  public ordersListTitleIsVisible: boolean;
  public all_order_data: Array<IOrder>;
  public all_bid_data: Array<IOrderBid>;
  public JSON: any;
  public addEditOrderForm: FormGroup;
  public addEditBidForm: FormGroup = this.formBuilder.group({
    product: [{ value: '' }, Validators.required],
    quantity: [{ value: '' }, Validators.required],
    dateCreated: [{ value: '' }, Validators.required],
    orderer: [{ value: '' }, Validators.required],
    orderStatus: [{ value: '' }, Validators.required],
    orderBids: [{ value: '' }, Validators.required],
    unit: [{ value: '' }, Validators.required],
    costPerUnit: [{ value: '' }, Validators.required],
    biddingPrice: [{ value: '' }, Validators.required],
    bidQuantity: [{ value: '' }, Validators.required],
    status: [{ value: '' }, Validators.required],
    sellType: [{ value: '' }, Validators.required],
    selfDelivery: [{ value: '' }, Validators.required],
    shipCost: [{ value: '' }, Validators.required],
    expectedDate: [{ value: '' }, Validators.required],
    deliveryDate: [{ value: '' }, Validators.required],
    maxReactionTime: [{ value: '' }, Validators.required],
  });
  public isFormSubmitted: boolean; //for form validation
  public popup_header: string;
  public isBidCreate: boolean;
  public add_order: boolean;
  public edit_order: boolean;
  public products: Array<IProduct>;
  public single_order_data: IOrder;
  private single_bid_data: IOrderBid;
  public wallet_pkh: string;
  public wallet_id: string;
  public isViewOrder: boolean = true;

  public undoIsViewOrder() {
    this.isViewOrder = false;
  }

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrdersService,
    private blockchainOrderService: BC_OrderService,
    private blockchainOrderBidService: BC_OrderBidService,
    private toastr: ToastrService,
    private productService: ProductService,
    public helperService: HelperService,
    private bidsService: BidsService
  ) {
    this.JSON = JSON;
    this.wallet_pkh = JSON.parse(JSON.stringify(this.helperService.isLoggedIn.value.wallet)).wiPubKeyHash.getPubKeyHash;
    this.wallet_id = JSON.parse(JSON.stringify(this.helperService.isLoggedIn.value.wallet)).wiWallet.getWalletId;
  }

  ngOnInit() {
    this.ordersListTitleIsVisible = true;
    this.addEditOrderForm = this.formBuilder.group({
      product: ['', Validators.required],
      quantity: ['', Validators.required],
      sellType: [{ value: '' }, Validators.required],
      selfDelivery: [{ value: '' }, Validators.required],
      shipCost: [{ value: '' }, Validators.required],
      expectedDate: [{ value: '' }, Validators.required],
      deliveryDate: [{ value: '' }, Validators.required],
      unit: [{ value: '' }, Validators.required],
      costPerUnit: [{ value: '' }, Validators.required],
    });
    this.getAllOrders();
    this.getAllProducts();
  }

  get rf() {
    return this.addEditOrderForm.controls;
  }

  protected getAllOrders(owner: string = null) {
    this.orderService.getAllOrders().subscribe(
      (data: Array<IOrder>) => {
        if (owner) {
          data.forEach(order => {
            if (order.orderer == owner) {
              this.all_order_data.push(order)
            }
          });
        } else {
          this.all_order_data = data;
        }
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }
  
  protected getAllOrderBids(order: IOrder) {
    this.bidsService.getAllBids().subscribe(
      (data: Array<IOrderBid>) => {
        this.all_bid_data = new Array<IOrderBid>();
        data.forEach(bid => {
          if (bid.order.orderer == this.wallet_pkh && bid.order.id == order.id) {
            this.all_bid_data.push(bid)
          }
        });
      },
      (error) => {
        console.log('Problem fetching OrderBids', error);
      }
    );
  }

  private getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (data: Array<IProduct>) => {
        this.products = data;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }
  public addOrderPopup() {
    this.add_order = true;

    this.edit_order = false;
    this.popup_header = 'Add New Order';
    this.addEditOrderForm.reset();
  }

  public async addNewOrder(wallet_id: string) {
    this.isFormSubmitted = true;
    if (this.addEditOrderForm.invalid) {
      return;
    }
    const value = this.addEditOrderForm.value;

    await this.blockchainOrderService.create(value, this.wallet_id, this.wallet_pkh).then(
      (ret) => {
        jQuery('#addEditOrderModal').modal('toggle');
        this.getAllOrders();
      }
    );

  }

  public editOrderPopup(id: string) {
    this.add_order = false;
    this.edit_order = true;
    this.popup_header = 'Edit Order';
    this.addEditOrderForm.reset();
    this.orderService.singleOrder(id).subscribe((data: IOrder) => {
      this.single_order_data = data;
      const value = data;
      this.addEditOrderForm.setValue({
        product: JSON.stringify(value.product),
        quantity: value.quantity,
        sellType: value.sellType,
        selfDelivery: value.selfDelivery,
        shipCost: value.shipCost,
        expectedDate: value.expectedDate,
        deliveryDate: value.deliveryDate,
      });
    });
  }

  public viewOrderPopup(id: string) {
    this.add_order = false;
    this.edit_order = false;
    this.isViewOrder = false;
    this.popup_header = 'Order Details';
    this.orderService.singleOrder(id).subscribe((data: IOrder) => {
      this.single_order_data = data;
      this.getAllOrderBids(data);
    });
  }

  public updateOrder() {
    this.isFormSubmitted = true;
    if (this.addEditOrderForm.invalid) {
      return;
    }
    const value = this.addEditOrderForm.value;
    const reqData: any = {
      product: JSON.parse(value.product),
      quantity: value.quantity,
      sellType: value.sellType,
      selfDelivery: value.selfDelivery,
      shipCost: value.shipCost,
      expectedDate: value.expectedDate,
      deliveryDate: value.deliveryDate,
    };
    Object.assign(this.single_order_data, reqData);
    this.orderService
      .updateOrder(this.single_order_data.id, this.single_order_data)
      .subscribe(
        (data: Array<IOrder>) => {
          this.single_order_data = undefined;
          jQuery('#addEditOrderModal').modal('toggle');
          this.getAllOrders();
        },
        (err) => {
          this.toastr.error('Some Error Occured!', 'FAILED!');
        }
      );
  }

  public updateStatus(order, status) {
    Object.assign(order, { status });

    this.orderService.updateOrder(order.id, order).subscribe(
      (data) => {
        this.getAllOrders();
      },
      (err) => {
        alert('Some Error Occured');
      }
    );
  }

  public deleteOrder(id: string) {
    let r = confirm('Do you want to delete the order  ID: ' + id + '?');
    if (r === true) {
      this.orderService.deleteOrder(id).subscribe(
        (data) => {
          this.toastr.success('Order deleted', 'Success!');
          this.getAllOrders();
        },
        (err) => {
          this.toastr.error('Some Error Occured!', 'FAILED!');
        }
      );
    } else {
    }
  }

  public async deleteOrderBid(bid: IOrderBid) {
    let r = confirm(
      'Do you want to delete the order  ID: ' + bid.id + '?'
    );
    if (r === true) {
      return await this.blockchainOrderBidService.cancel(bid, this.wallet_id).then(
        (ret) => {
          this.toastr.success('Bid deleted', 'Success!');
          jQuery('#addEditBidModal').modal('toggle');
        }
      );
    } else {
    }
  }

  public async acceptOrderBid(bid: IOrderBid) {
    let r = confirm(
      'Do you want to accept the OrderBid ID: ' + bid.id + '?'
    );
    if (r === true) {
      return await this.blockchainOrderBidService.accept(bid, this.wallet_id).then(
        (ret) => {
          this.toastr.success('Bid accepted', 'Success!');
          jQuery('#addEditBidModal').modal('toggle');
        }
      );
    } else {
    }
  }

  public async rejectOrderBid(bid: IOrderBid) {
    let r = confirm(
      'Do you want to reject the OrderBid ID: ' + bid.id + '?'
    );
    if (r === true) {
      return await this.blockchainOrderBidService.reject(bid, this.wallet_id).then(
        (ret) => {
          this.toastr.success('Bid rejected', 'Success!');
          jQuery('#addEditBidModal').modal('toggle');
        }
      );
    } else {
    }
  }

  public async pickupOrderBid(bid: IOrderBid) {
    return await this.blockchainOrderBidService.pickup(bid, this.wallet_id).then(
      (ret) => {
        this.toastr.success('Product picked up', 'Success!');
        jQuery('#addEditBidModal').modal('toggle');
      }
    );
  }

  public openBidDialog(order: IOrder) {
    this.popup_header = 'Create Bid';
    this.isBidCreate = true;
    this.single_order_data = order;
    this.addEditBidForm.setValue({
      product: order.product.name,
      quantity: order.quantity,
      dateCreated: order.dateCreated,
      orderer: order.orderer,
      orderStatus: order.status,
      unit: order.unit,
      costPerUnit: order.costPerUnit,
      sellType: order.sellType,
      selfDelivery: order.selfDelivery,
      shipCost: order.shipCost,
      expectedDate: order.expectedDate,
      deliveryDate: order.deliveryDate,
      orderBids: 0,
      biddingPrice: 0,
      bidQuantity: 0,
      status: 'PENDING',
      maxReactionTime: 0,
    });
  }

  public async addNewBid() {
    this.isFormSubmitted = true;
    if (this.addEditBidForm.invalid) {
      return;
    }
    const value = this.addEditBidForm.value;

    await this.blockchainOrderBidService.create(this.single_order_data, value, this.wallet_id, this.wallet_pkh).then(
      (ret) => {
        jQuery('#addEditBidModal').modal('toggle');
        this.getAllOrders();
      }
    );
  }

  public updateBidStatus(order: IOrder, status) {
    const bidderId = order.bidder;
    this.bidsService.updateBidStatus(bidderId, { status }).subscribe(
      (data) => {
        this.getAllOrders();
      },
      (err) => {
        alert('Some Error Occured');
      }
    );
  }
}
