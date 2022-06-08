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
import { TaskListStatusComponent } from './components/lists.component';
import { TaskStatusRoutes } from './taskStatus.routing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
@NgModule({
    imports: [
        CommonModule,
        DemoMaterialModule,
        FlexLayoutModule,
        ChartistModule,
        ChartsModule,
        FormsModule,
        NgApexchartsModule,
        MatPaginatorModule,
        MatSortModule,
        ReactiveFormsModule,
        RouterModule.forChild(TaskStatusRoutes)
    ],
    declarations: [TaskListStatusComponent],
    providers:[FormBuilder, TasksService]
})
export class TasksStatusModule { }
