import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CaptainsRoutes } from './captains.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {ViewComponent} from "./components/view/view.component";
import {EditComponent} from "./components/edit/edit.component";
import {ListingComponent} from "./components/listing/listing.component";
import {FormBuilder, FormsModule} from "@angular/forms";
import {CaptainsService} from "./services/captains.service";
import { ReactiveFormsModule } from '@angular/forms';
import {CaptaincreateComponent} from "./components/create/captaincreate.component";
import {AuthService} from '../login/services/auth.service';
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
        RouterModule.forChild(CaptainsRoutes)
    ],
    declarations: [CaptaincreateComponent,ViewComponent,EditComponent,ListingComponent],
    providers:[FormBuilder , CaptainsService,AuthService]
})
export class CaptainsModule { }
