import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TasksBoardRoutes } from './taskboard.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TaskboardComponent } from "./taskboard/taskboard.component";
import { FormBuilder, FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { TaskboardService } from "./services/taskboard.service";

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
        RouterModule.forChild(TasksBoardRoutes),
        DragulaModule.forRoot(),
    ],
    declarations: [TaskboardComponent],
    providers:[FormBuilder, TaskboardService]
})
export class TasksBoardModule { }
