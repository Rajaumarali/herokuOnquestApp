import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TasksRoutes } from './tasks.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {ViewComponent} from "./components/view/view.component";
import {EditComponent} from "./components/edit/edit.component";
import {ListingsComponent} from "./components/listings/listings.component";
import {FormBuilder, FormsModule} from "@angular/forms";
import {TasksService} from "./services/tasks.service";
import { ReactiveFormsModule } from '@angular/forms';
import {AuthService} from '../resident/services/auth.service';
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
        MatAutocompleteModule,
        RouterModule.forChild(TasksRoutes)
    ],
    declarations: [ViewComponent,EditComponent,ListingsComponent],
    providers:[FormBuilder , TasksService, AuthService]
})
export class TasksModule { }
