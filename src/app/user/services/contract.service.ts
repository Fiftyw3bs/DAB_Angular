import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { IWallet } from '../model/wallet';
import { IContract } from '../model/contract';
import { IToken } from '../model/token';

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  public contract_url = environment.contract_url + '/api/contract/';
  public wallet_url = environment.contract_url + '/wallet/create';

  constructor(private apiService: ApiService) {}

  public createInstance(contract: string, wallet_id: string): Promise<IContract> {
    var pay_load = { "caID": contract
                  , "caWallet": { "getWalletId": wallet_id }
                  }
    return this.apiService.post(this.contract_url + "activate", pay_load).toPromise()
  }

  public getAllInstances(wallet_id: number): Observable<Array<IContract>> {
    return this.apiService.get(this.contract_url + "instances/wallet/" + wallet_id)
  }

  public gen_wallet(wallet_data: any): Observable<IWallet> {
    return this.apiService.post(this.wallet_url, wallet_data);
  }

  public async status(contract: IContract): Promise<any> {
    return await this.apiService.get(this.contract_url + 'instance/' + this.stripquotes(JSON.parse(JSON.stringify(contract)).unContractInstanceId) + "/status").toPromise()
  }

  private stripquotes(a) {
    if (a.charAt(0) === '"' && a.charAt(a.length-1) === '"') {
        return a.substr(1, a.length-2);
    }
    return a;
  }

  public send_request(entity: any, contract: string, contract_instance_id: IContract, action: string): Promise<JSON> {
    return this.apiService.post(this.contract_url + 'instance/' + this.stripquotes(JSON.parse(JSON.stringify(contract_instance_id)).unContractInstanceId) + "/endpoint/" + action + "-" + contract, entity).toPromise()
  }
  
  public async get_thread_token(contract: IContract): any {
    var tt: any;
    await this.status(contract).then(
      retVal => {
        // tt = JSON.parse(retVal).cicCurrentState;
        console.log(retVal.cicCurrentState)
        alert()
      },
      (error) => {
        console.log("Something went wrong", error)
      }
    );
    return tt;
  }

  public contracts(): Observable<JSON> {
      return this.apiService.get(this.contract_url + "instances")
  }
  public get_last_log(contract: IContract): Observable<string> {
    var ret: Observable<string>;

    this.contracts().subscribe(
      retVal => {
        if (retVal) {
          if (retVal["cicContract"]["unContractInstanceId"] == contract.instance_id) {
            if (retVal["cicCurrentState"]["lastLogs"]) {
              ret = retVal["cicCurrentState"]["lastLogs"][0]["_logMessageContent"];
            }
          }
        }
      }
    );

    return ret;

  }

}
