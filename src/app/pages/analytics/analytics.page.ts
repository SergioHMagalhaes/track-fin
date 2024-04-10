import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-analytics',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss']
})
export class AnalyticsPage {
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 90 ], label: 'Entradas', backgroundColor: '#2dd36f', },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Saídas',  backgroundColor: '#eb445a' }
    ]
  };

  public doughnutChartLabels: string[] = [
    'Alimentação',
    'Lazer',
    'outros'
  ];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
    [
      { data: [350, 450, 100] },
    ];

  constructor() {}

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins : {
      legend: {
        align: 'start',
        position: 'bottom',

        labels: {
          padding: 25,
          font: {
            family: 'Roboto-Regular',
          }
        }
      }
    }
  };
}
