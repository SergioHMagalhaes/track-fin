import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

import { ITransfer } from 'src/app/models/transfer';

export enum Models {
  transfer = 'transfer'
}

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {

  public transfer!: Table<ITransfer, number>;

  constructor() {
    super('track-fin');
    this.version(1).stores({
      transfer: '++id,category,description,amount,date,type',
    });
  }

  public async save(model: Models, data: ITransfer) {
    await db[model].add(data);
  }

  public async getAll(model: Models) {
	  return await db[model].toArray();
  }

  public async update(model: Models, data: ITransfer) {
    if (!data.id) return;
    await db[model].update(data.id, data);
  }

  public async remove(model: Models, id: number) {
	  await db[model].delete(id);
  }
}

export const db = new DbService();
