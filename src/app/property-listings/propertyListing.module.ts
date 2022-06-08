import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PropertyListingRoutes } from './propertyListing.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {LocationListingComponent} from "./components/listings/locationlisting.component";
import {LocationEditComponent} from "./components/edit/locationedit.component";
import {LocationCreateComponent} from "./components/create/locationcreate.component";
import {LocationService} from "./services/location.service";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MyCommonModule} from "../common/common.module";
import { ViewComponent } from './components/view/view.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";


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
        ReactiveFormsModule,
        GooglePlaceModule,
        RouterModule.forChild(PropertyListingRoutes)
    ],
    declarations: [LocationListingComponent, LocationEditComponent, LocationCreateComponent, ViewComponent],
    providers:[FormBuilder,LocationService]
})
export class PropertyListingModule { }
