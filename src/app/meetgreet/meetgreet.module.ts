import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
// import {TicketService} from "./services/ticket.service";
import { MeetGreetListingComponent } from './component/listing/listing.component';
import { MeetGreetRoutes } from './meetgreet.routing';
import { MeetService } from './services/meet.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyCommonModule } from '../common/common.module';
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
        RouterModule.forChild(MeetGreetRoutes)
    ],
    declarations: [MeetGreetListingComponent],
    providers:[MeetService, FormBuilder]
})
export class MeetGreetModule { }
