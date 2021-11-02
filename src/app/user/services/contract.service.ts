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

  public createInstance(contract: string, wallet_id: string): Observable<IContract> {
    var pay_load = { "caID": contract
                  , "caWallet": { "getWallet": wallet_id }
                  }
    return this.apiService.post(this.contract_url + "activate", pay_load)
  }

  public getAllInstances(wallet_id: number): Observable<Array<IContract>> {
    return this.apiService.get(this.contract_url + "instances/wallet/" + wallet_id)
  }

  public gen_wallet(wallet_data: any): Observable<IWallet> {
    return this.apiService.post(this.wallet_url, wallet_data);
  }

  public status(contract: IContract): Observable<JSON> {
    return this.apiService.get(this.contract_url + 'instance/' + contract.instance_id + "/status")
  }

  public send_request(entity: any, contract: IContract, action: string): Observable<JSON> {
    return this.apiService.post(this.contract_url + 'instance/' + contract.instance_id + "/endpoint/" + action + contract.name, entity)
  }

  public get_thread_token(contract: IContract): Observable<IToken> {
    var ret: Observable<IToken>;

    this.status(contract).subscribe(
      retVal => {
        if (retVal["cicCurrentState"]["observableState"]) {
          var myToken: IToken;
          myToken.currencySymbol = retVal["cicCurrentState"]["observableState"]["ttCurrencySymbol"];
          myToken.tokenName = retVal["cicCurrentState"]["observableState"]["ttOutRef"];
          ret = new Observable(subscriber => {
            subscriber.next(myToken);
            setTimeout(() => {
              subscriber.next(myToken); // happens asynchronously
            }, 1000);
          });
        }
      }
    );

    return ret;
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
