import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResidentlistingRoutes } from './residentlisting.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ListingsComponent } from "./components/listings/listings.component";
import { FormBuilder, FormsModule } from "@angular/forms";
import { ResidentlistingService } from "./services/residentlisting.service";
import { ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../property-listings/services/location.service';
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
        RouterModule.forChild(ResidentlistingRoutes)
    ],
    declarations: [ListingsComponent],
    providers:[FormBuilder , ResidentlistingService,LocationService]
})
export class ResidentListingModule { }
