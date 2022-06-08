import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {RestrictedServicesRoutes} from './restrictedservices.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {ServiceeditComponent} from "./components/serviceedit/serviceedit.component";
import {ServicelistingComponent} from "./components/servicelisting/servicelisting.component";
import {FormBuilder, FormsModule} from "@angular/forms";
import {ServiceService} from "./services/service.service";
import { ReactiveFormsModule } from '@angular/forms';
import {AuthService} from "../login/services/auth.service";
import {LocationService} from "../property-listings/services/location.service";
import {ServicecreateComponent} from "./components/servicecreate/servicecreate.component";
import {MyCommonModule} from "../common/common.module";

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
        MyCommonModule,
        RouterModule.forChild(RestrictedServicesRoutes)
    ],
    declarations: [ServiceeditComponent,ServicecreateComponent,ServicelistingComponent],
    providers:[FormBuilder , ServiceService ,AuthService,LocationService]
})
export class RestrictedservicesModule { }
