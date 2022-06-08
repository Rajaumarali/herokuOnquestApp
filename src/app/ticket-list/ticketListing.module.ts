import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TicketListingRoutes } from './ticketListing.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {TicketService} from "./services/ticket.service";
import { ListingComponent } from './components/listing/listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        DemoMaterialModule,
        FlexLayoutModule,
        ChartistModule,
        ChartsModule,
        NgApexchartsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(TicketListingRoutes)
    ],
    declarations: [ListingComponent, ListingComponent],
    providers:[TicketService]
})
export class TicketListingModule { }
