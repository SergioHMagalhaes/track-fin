import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

import { IAccount } from 'src/app/models/account';
import { ITransfer } from 'src/app/models/transfer';

export enum Models {
  Account = 'account',
  Transfer = 'transfer'
}

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {

  public account!: Table<IAccount, number>;
  public transfer!: Table<ITransfer, number>;

  constructor() {
    super('track-fin');
    this.version(1).stores({
      account: '++id,name,amount',
      transfer: '++id,category,description,amount,date,type',
    });
  }
}

export const db = new DbService();
