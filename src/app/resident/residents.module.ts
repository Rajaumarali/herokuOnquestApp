import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResidentRoutes } from './residents.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {ResidentviewComponent} from "./components/view/residentview.component";
import {ResidenteditComponent} from "./components/edit/residentedit.component";
import {ResidentlistingComponent} from "./components/listings/residentlisting.component";
import {FormBuilder, FormsModule} from "@angular/forms";
import {ResidentService} from "./services/resident.service";
import {AuthService} from "./services/auth.service";
import {PropertyService} from "../properties/services/property.service";
import { ReactiveFormsModule } from '@angular/forms';
import {ResidentcreateComponent} from "./components/create/residentcreate.component";
import {LocationService} from "../property-listings/services/location.service";
import {
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MessageLogsComponent} from './components/messageLogs/messageLogs.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
        GooglePlaceModule,
        MatAutocompleteModule,
        RouterModule.forChild(ResidentRoutes)
    ],
    declarations: [ResidentcreateComponent,ResidentviewComponent,ResidenteditComponent,ResidentlistingComponent,MessageLogsComponent],
    providers:[FormBuilder , ResidentService, AuthService,PropertyService,LocationService]
})
export class ResidentsModule { }
