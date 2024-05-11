import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

import { DbService } from '../db/db.service';
import { IAccount } from 'src/app/models/account';
import { Type } from 'src/app/models/transfer';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private _account: IAccount | null = null;
  private accountObservable = new BehaviorSubject<IAccount | null>(null);

  constructor(
    private readonly db: DbService,
  ) { }

  public async getAccount() {
    return await this.db.account.get(1);
  }

  public get account (): IAccount | null{
		return this._account;
	}

  public getAccountObservable (): BehaviorSubject<IAccount | null> {
		return this.accountObservable;
	}

  public async setAccount(value?: IAccount) {
		let account;
		if (value)
			account = value;
		else
    account = await this.getAccount();

		if (account) {
			this._account = account;
			this.accountObservable.next(account);
		}
		else {
			this._account = null;
			this.accountObservable.next(null);
		}
	}

  public async calculateAmount() {
    const account = await this.db.account.get(1);
    if (!account) return;

    const transfers = await this.db.transfer.toArray();
    const amount = transfers.reduce((acc, transfer) => {
      if (transfer.type === Type.sent)
        return acc - transfer.amount;
      return acc + transfer.amount;
    }, account.amount);

    account.amount = amount;
    await this.db.account.put(account);
  }
}
