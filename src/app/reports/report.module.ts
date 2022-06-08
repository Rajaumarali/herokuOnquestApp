import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {ReportRoutes} from './report.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MyCommonModule} from "../common/common.module";
import {ReportsService} from "./services/reports.service";
import {ReportsComponent} from "./report/reports.component";
import {ViewreportsComponent} from "./view/viewreports.component";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule} from '@angular-material-components/datetime-picker';
import {NgxMatMomentModule} from '@angular-material-components/moment-adapter';


@NgModule({
    imports: [
        CommonModule,
        DemoMaterialModule,
        FlexLayoutModule,
        ChartistModule,
        ChartsModule,
        FormsModule,
        MyCommonModule,
        NgApexchartsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,

        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        NgxMatMomentModule,

        MatInputModule,
        ReactiveFormsModule,
        RouterModule.forChild(ReportRoutes)
    ],
    declarations: [ReportsComponent, ViewreportsComponent],
    providers: [ReportsService],
    exports: [ MatInputModule ]
})
export class ReportModule { }
