import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IContract } from 'src/app/user/model/contract';
import { ContractsService } from '../../services/contract.service';
import { IWallet } from '../../model/wallet';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})
export class ContractsComponent implements OnInit {
  public all_contract_data: Array<IContract>;

  constructor(
    private router: Router,
    private contract_service: ContractsService
  ) {}
  ngOnInit() {
  }

  public getOrderContract(wallet: IWallet) {
    this.contract_service.createInstance("Order", wallet.id).subscribe(
      (data: IContract) => {
        this.all_contract_data.push(data);
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  public getOrderBidContract(wallet: IWallet) {
    this.contract_service.createInstance("OrderBid", wallet.id).subscribe(
      (data: IContract) => {
        this.all_contract_data.push(data);
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  public getShipBidContract(wallet: IWallet) {
    this.contract_service.createInstance("ShipBid", wallet.id).subscribe(
      (data: IContract) => {
        this.all_contract_data.push(data);
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  public getAllContracts(wallet: IWallet) {
    this.contract_service.getAllInstances(wallet.id).subscribe(
      (data: Array<IContract>) => {
        this.all_contract_data = data;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

}
