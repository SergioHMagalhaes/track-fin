import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AnalyticsService, RevenueExpensesMatrix } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss']
})
export class AnalyticsPage implements OnInit, ViewDidEnter {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public revenueExpensesMatrix: RevenueExpensesMatrix = {
    labels: [],
    dataInflows: [],
    dataOutflows: []
  };
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.revenueExpensesMatrix.labels,
    datasets: [
      { data: this.revenueExpensesMatrix.dataInflows, label: 'Entradas', backgroundColor: '#2dd36f', },
      { data: this.revenueExpensesMatrix.dataOutflows, label: 'Saídas',  backgroundColor: '#eb445a' }
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

  constructor(
    private readonly analyticsService: AnalyticsService
  ) {}

  public async ngOnInit() {
    this.setBarChartData();
  }

  public async ionViewDidEnter() {
    this.setBarChartData();
  }

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

  public async setBarChartData () {
    this.revenueExpensesMatrix = await this.analyticsService.getRevenueExpensesMatrix();
    this.barChartData.labels = this.revenueExpensesMatrix.labels;
    this.barChartData.datasets[0].data = this.revenueExpensesMatrix.dataInflows;
    this.barChartData.datasets[1].data = this.revenueExpensesMatrix.dataOutflows;
    if (this.chart)
      this.chart.update();
  }
}
