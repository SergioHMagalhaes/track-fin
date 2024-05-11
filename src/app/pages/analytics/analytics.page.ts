import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
import { ChartConfiguration } from 'chart.js';
import * as dayjs from 'dayjs';
import { BaseChartDirective } from 'ng2-charts';
import { AnalyticsService, RevenueExpensesMatrix } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss']
})
export class AnalyticsPage implements OnInit, ViewDidEnter {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public currentYear = dayjs().year();
  public averageAnnualSpending = 0;
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
  public doughnutChartLabels: string[] = [];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    { data: [],
      backgroundColor: [
        '#4ea39c',
        '#36a2eb',
        '#7221aa',
        '#ff6384',
        '#ffcd56',
        '#ffC0CB',
        '#054606',
      ],
    },
  ];
  public doughnutColors:any[] = [
    { backgroundColor: ["#86c7f3", "#ffe199"] }
  ];

  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  public async ngOnInit() {
    this.setBarChartData();
    this.setDoughnutChartData();
    this.averageAnnualSpending = await this.analyticsService.getAverageAnnualSpending();
  }

  public async ionViewDidEnter() {
    this.setBarChartData();
    this.setDoughnutChartData();
    this.averageAnnualSpending = await this.analyticsService.getAverageAnnualSpending();
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

  public async setDoughnutChartData () {
    const { data, labels } = await this.analyticsService.getExpensesByCategoriesMatrix();
    this.doughnutChartLabels = labels;
    this.doughnutChartDatasets[0].data = data;

  }
}
