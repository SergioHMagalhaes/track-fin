import { Injectable } from '@angular/core';

import * as dayjs from "dayjs";

import { DbService } from '../db/db.service';

export interface RevenueExpensesMatrix {
  labels: string[];
  dataInflows: number[];
  dataOutflows: number[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private readonly db: DbService
  ) { }


  public async getRevenueExpensesMatrix (): Promise<RevenueExpensesMatrix> {
    const labels: string[] = [];
    const dataInflows: number[] = [];
    const dataOutflows: number[] = [];
    const startDate = dayjs().startOf('year');
    const transfers = await this.db.transfer.where('date')
    .aboveOrEqual(startDate.toDate())
    .sortBy('data');

    const firstMonth = dayjs(transfers[0].date).month();
    const lastMonth =  dayjs(transfers[transfers.length - 1].date).month();

    for (let i = firstMonth; i <= lastMonth; i++) {
      labels.push(this.getMonthName(i));
    }

    for (let i = 0; i < labels.length; i++) {
      const month = this.getMonthNumber(labels[i]);
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

  getMonthName (month: number): string {
    switch (month) {
      case 0: return 'Janeiro';
      case 1: return 'Fevereiro';
      case 2: return 'Março';
      case 3: return 'Abril';
      case 4: return 'Maio';
      case 5: return 'Junho';
      case 6: return 'Julho';
      case 7: return 'Agosto';
      case 8: return 'Setembro';
      case 9: return 'Outubro';
      case 10: return 'Novembro';
      case 11: return 'Dezembro';
      default: return '';
    }
  }

  getMonthNumber (month: string): number {
    switch (month) {
      case 'Janeiro': return 0;
      case 'Fevereiro': return 1;
      case 'Março': return 2;
      case 'Abril': return 3;
      case 'Maio': return 4;
      case 'Junho': return 5;
      case 'Julho': return 6;
      case 'Agosto': return 7;
      case 'Setembro': return 8;
      case 'Outubro': return 9;
      case 'Novembro': return 10;
      case 'Dezembro': return 11;
      default: return 0;
    }
  }
}
