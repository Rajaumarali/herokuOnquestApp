import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormBuilder, FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { TasksService } from '../tasks/services/tasks.service';
import { TasksComponent } from './components/tasks/tasks.component';
import { TasksOutRoutes } from './tasks.routing';
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
        RouterModule.forChild(TasksOutRoutes)
    ],
    declarations: [TasksComponent],
    providers:[FormBuilder, TasksService]
})
export class TasksOutModule { }
