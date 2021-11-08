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
  public isSubmitted: boolean;

  constructor(
    private router: Router,
    private contract_service: ContractsService
  ) {}
  ngOnInit() {
  }

  private capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public create(wallet_id: string, entity: any, contract: string) {
    this.contract_service.createInstance(this.capitalizeFirstLetter(contract), wallet_id).then(
      (contract: IContract) => {
        this.contract_service.send_request(entity, "", contract, "create").then(
          (response: JSON) => {
            console.log('Order sent', response)
            this.isSubmitted = true;
          },
          (error) => {
            console.log('Could not create Order', error)
          }
        )
        console.log(contract);
        this.all_contract_data.push(contract);
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  public cancel(wallet_id: string, entity: any, contract: string) {
    this.contract_service.createInstance(contract, wallet_id).then(
      (data: IContract) => {
        this.all_contract_data.push(data);
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  public status(wallet_id: string, entity: any, contract: string) {
    this.contract_service.createInstance(contract, wallet_id).then(
      (data: IContract) => {
        this.all_contract_data.push(data);
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  public getAllContracts(wallet_id: number) {
    this.contract_service.getAllInstances(wallet_id).subscribe(
      (data: Array<IContract>) => {
        this.all_contract_data = data;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

}
