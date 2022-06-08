import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CaptainsRoutes } from './profile.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {EditComponent} from "./components/edit/edit.component";
import {FormBuilder, FormsModule} from "@angular/forms";
import {ProfileService} from "./services/profile.service";
import { ReactiveFormsModule } from '@angular/forms';
import {AuthService} from "../login/services/auth.service";
import { ChangePassword } from './components/changepassword/changepassword.component';

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
    declarations: [EditComponent,ChangePassword],
    providers:[FormBuilder , ProfileService ,AuthService]
})
export class ProfileModule { }
