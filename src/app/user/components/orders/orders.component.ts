import { IBid } from './../../model/orderBid.d';
import { HelperService } from './../../../services/helper.service';
import { ProductService } from './../../../admin/services/product.service';
import { ContractsService } from './../../../user/services/blockchain/contract.service';
import { IProduct } from './../../../admin/models/product.d';
import { OrdersService } from './../../services/orders.service';
import { IOrder } from './../../model/order.d';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BidsService } from '../../services/bids.service';
import { ContractsComponent } from '../contract/contracts.component';
import { IToken } from '../../model/token';
import { OrderService } from '../../services/blockchain/order.service';
import { OrderBidService } from '../../services/blockchain/orderbid.service';
declare var jQuery: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  @ViewChild("app-contracts") contract_component: ContractsComponent;

  public all_order_data: Array<IOrder>;
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
  private single_bid_data: IBid;

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrdersService,
    private blockchainOrderService: OrderService,
    private blockchainOrderBidService: OrderBidService,
    private toastr: ToastrService,
    private productService: ProductService,
    public helperService: HelperService,
    private bidsService: BidsService
  ) {
    this.JSON = JSON;
  }

  ngOnInit() {
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

  private getAllOrders() {
    this.orderService.getAllOrders().subscribe(
      (data: Array<IOrder>) => {
        this.all_order_data = data;
      },
      (error) => {
        console.log('My error', error);
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

    var wallet_pkh = JSON.parse(JSON.stringify(this.helperService.isLoggedIn.value.wallet)).wiPubKeyHash.getPubKeyHash;

    await this.blockchainOrderService.create(value, wallet_id, wallet_pkh).then(
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
          console.log('deleted successfully', data);
          this.getAllOrders();
        },
        (err) => {
          this.toastr.error('Some Error Occured!', 'FAILED!');
        }
      );
    } else {
    }
  }
  public deleteBid() {
    let r = confirm(
      'Do you want to delete the order  ID: ' + this.single_bid_data.id + '?'
    );
    if (r === true) {
      this.bidsService.deleteBid(this.single_bid_data.id).subscribe(
        (data) => {
          this.orderService.updateOrderBid(this.single_bid_data.order.id, {
            bids: 0,
            bidder: undefined,
          });
          console.log('deleted successfully', data);
          this.getAllOrders();
        },
        (err) => {
          this.toastr.error('Some Error Occured!', 'FAILED!');
        }
      );
    } else {
    }
  }

  public openBidDialog(order: IOrder) {
    if (order.bidder) {
      this.bidsService.singleBid(order.bidder).subscribe(
        (data) => {
          this.popup_header = 'Update Bid';
          this.single_bid_data = data;
          this.isBidCreate = false;
          this.single_order_data = order;
          this.addEditBidForm.setValue({
            product: order.product.name,
            quantity: order.quantity,
            dateCreated: order.dateCreated,
            orderer: order.orderer,
            orderStatus: order.status,
            orderBids: order.bids,
            biddingPrice: data.biddingPrice,
            bidQuantity: data.bidQuantity,
            maxReactionTime: data.maxReactionTime,
            status: data.status,
            sellType: data.sellType,
            selfDelivery: data.selfDelivery,
            shipCost: data.shipCost,
            expectedDate: data.expectedDate,
            deliveryDate: data.deliveryDate,
          });
        },
        (err) => {
          alert('Some Error Occured');
        }
      );
    } else {
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
  }

  public async addNewBid(wallet_id: string) {
    this.isFormSubmitted = true;
    if (this.addEditBidForm.invalid) {
      return;
    }
    const value = this.addEditBidForm.value;

    var wallet_pkh = JSON.parse(JSON.stringify(this.helperService.isLoggedIn.value.wallet)).wiPubKeyHash.getPubKeyHash;

    await this.blockchainOrderBidService.create(this.single_order_data, value, wallet_id, wallet_pkh).then(
      (ret) => {
        jQuery('#addEditOrderModal').modal('toggle');
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
