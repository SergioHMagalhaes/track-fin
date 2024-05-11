import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsPage } from './analytics.page';

import { AnalyticsPageRoutingModule } from './analytics-routing.module';
import { BaseChartDirective } from 'ng2-charts';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AnalyticsPageRoutingModule,
    BaseChartDirective
  ],
  declarations: [AnalyticsPage]
})
export class Tab2PageModule {}
