import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CalendarRoutes } from './calendar.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormBuilder, FormsModule } from "@angular/forms";
import { CalendarService } from "./services/calendar.service";
import { ReactiveFormsModule } from '@angular/forms';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatDialogRef, } from '@angular/material/dialog';
import { CalendarModule, DateAdapter, CalendarDateFormatter } from 'angular-calendar';
import { FullcalendarComponent } from './components/calendar/fullcalendar.component';
import { CalendarDialogComponent } from './components/calendar/fullcalendar.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
@NgModule({
    imports: [
        CommonModule,
        DemoMaterialModule,
        FlexLayoutModule,
        ChartistModule,
        ChartsModule,
        FormsModule,
        NgApexchartsModule,
        ReactiveFormsModule,
        MatDialogModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        RouterModule.forChild(CalendarRoutes)
    ],
    exports : [FullcalendarComponent],
    declarations: [FullcalendarComponent, CalendarDialogComponent],
    providers:[FormBuilder, CalendarService, 
        {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}, 
        { provide: MatDialogRef, useValue: {} }],
    entryComponents: [CalendarDialogComponent]

})
export class CalendarsModule { }
