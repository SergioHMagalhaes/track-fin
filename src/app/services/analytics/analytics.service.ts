import { Injectable } from '@angular/core';

import * as dayjs from "dayjs";

import { DbService } from '../db/db.service';
import { UtilsService } from '../utils/utils.service';
import { Type } from 'src/app/models/transfer';

export interface RevenueExpensesMatrix {
  labels: string[];
  dataInflows: number[];
  dataOutflows: number[];
}

export interface ExpensesByCategoriesMatrix {
  labels: string[];
  data: number[];
}


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor (
    private readonly db: DbService,
    private readonly utils: UtilsService
  ) { }


  public async getRevenueExpensesMatrix (): Promise<RevenueExpensesMatrix> {
    const labels: string[] = [];
    const dataInflows: number[] = [];
    const dataOutflows: number[] = [];
    const startDate = dayjs().startOf('year');
    const transfers = await this.db.transfer.where('date')
    .aboveOrEqual(startDate.toDate())
    .sortBy('data');

    if (transfers.length === 0) {
      return { labels, dataInflows, dataOutflows };
    }

    const firstMonth = dayjs(transfers[0].date).month();
    const lastMonth =  dayjs(transfers[transfers.length - 1].date).month();

    for (let i = firstMonth; i <= lastMonth; i++) {
      labels.push(this.utils.getMonthName(i));
    }

    for (let i = 0; i < labels.length; i++) {
      const month = this.utils.getMonthNumber(labels[i]);
      const inflows = transfers
        .filter(transfer => dayjs(transfer.date).month() === month && transfer.type === 'inflows')
        .reduce((acc, transfer) => acc + transfer.amount, 0);

      const outflows = transfers
        .filter(transfer => dayjs(transfer.date).month() === month && transfer.type === 'outflows')
        .reduce((acc, transfer) => acc + transfer.amount, 0);
      dataInflows.push(inflows);
      dataOutflows.push(outflows);
    }

    return { labels, dataInflows, dataOutflows };

  }

  public async getExpensesByCategoriesMatrix (): Promise<ExpensesByCategoriesMatrix> {
    const labels: string[] = [];
    const data: number[] = [];
    const startDate = dayjs().startOf('year');
    const transfers = await this.db.transfer.where('date')
    .aboveOrEqual(startDate.toDate())
    .sortBy('data');

    for (const transfer of transfers) {
      if (transfer.type === Type.Outflows) {
        if (labels.includes(transfer.categoryName)) {
          data[labels.indexOf(transfer.categoryName)] += transfer.amount;
        } else {
          labels.push(transfer.categoryName);
          data.push(transfer.amount);
        }
      }
    }

    return { labels, data };
  }
}
