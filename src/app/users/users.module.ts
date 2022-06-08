import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UsersRoutes } from './users.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {FormBuilder, FormsModule} from "@angular/forms";
// import {UsersService} from "./services/users.service";
import {AuthService} from "./services/auth.service";
import {PropertyService} from "../properties/services/property.service";
import { ReactiveFormsModule } from '@angular/forms';
import {LocationService} from "../property-listings/services/location.service";
import {
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CreateComponent } from './components/create/create.component';
import { ListingsComponent } from './components/listings/listings.component';
import { ViewComponent } from './components/view/view.component';
import { EditComponent } from './components/edit/edit.component';
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
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        MatDatepickerModule,
        NgxMatMomentModule,
        RouterModule.forChild(UsersRoutes)
    ],
    declarations: [ CreateComponent, ListingsComponent, ViewComponent, EditComponent],
    providers:[FormBuilder , AuthService,PropertyService,LocationService]
})
export class UsersModule { }
