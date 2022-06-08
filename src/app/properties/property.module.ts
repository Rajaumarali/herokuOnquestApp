import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PropertyRoutes} from './property.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PropertyComponent } from './property/property.component';
import {PropertyService} from "./services/property.service";
import {CalendarsModule} from "../calendar/calendar.module";
@NgModule({
    imports: [
        CommonModule,
        DemoMaterialModule,
        FlexLayoutModule,
        ChartistModule,
        ChartsModule,
        CalendarsModule,
        NgApexchartsModule,
        RouterModule.forChild(PropertyRoutes)
    ],
    declarations: [PropertyComponent],
    providers:[PropertyService]
})
export class PropertyModule { }
