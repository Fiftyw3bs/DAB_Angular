import { Component, OnInit } from '@angular/core';
import { IToken } from './../../model/token.d';
import { ContractsService } from './../../services/blockchain/contract.service';
import { HelperService } from './../../../services/helper.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  public balances: Array<IToken>
  public wallet_pkh: string = JSON.parse(JSON.stringify(this.helperService.isLoggedIn.value.wallet)).wiPubKeyHash.getPubKeyHash;

  ngOnInit(): void {
    this.getBalance()
  }

  constructor(
    private contractService: ContractsService,
    public helperService: HelperService
  ) {}

  public getBalance() {

    var Ada: any = null;
    var tokens = new Array<IToken>();
    var wallet_id = JSON.parse(JSON.stringify(this.helperService.isLoggedIn.value.wallet)).wiWallet.getWalletId;
    var token: IToken;

    this.contractService.wallet_balance(wallet_id).subscribe(
      obj => {
        obj.getValue.forEach(elem => {
          elem.forEach(e => {
            var t = {
              currSymbol: null,
              name_balance: null
            };
            if (typeof e.unCurrencySymbol === 'string' || e.unCurrencySymbol instanceof String) {
                t.currSymbol = e.unCurrencySymbol
            } else {
              e.forEach(f => {
                f.forEach(g => {
                  if (typeof g.unTokenName === 'string' || g.unTokenName instanceof String) {
                    Ada = g.unTokenName
                  } else {
                    var kvPair = {Ada : g}
                    t.name_balance = kvPair
                    token = t
                  }
                })
              })
            }
          })
        tokens.push(token)
      })

      this.balances = tokens.filter(e => {
          return e.hasOwnProperty('name_balance')
      })
    })
  }
}
