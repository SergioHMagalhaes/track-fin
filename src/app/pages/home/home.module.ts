import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { HomePageRoutingModule } from './home-routing.module';
import { ComponentsModule } from "../../components/components.module";


@NgModule({
    declarations: [HomePage],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ExploreContainerComponentModule,
        HomePageRoutingModule,
        ComponentsModule
    ]
})
export class HomePageModule {}
