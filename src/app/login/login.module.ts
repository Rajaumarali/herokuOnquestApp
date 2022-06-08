import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {LoginRoutes} from './login.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {FormsModule, FormBuilder, FormControl, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from "./services/auth.service";
import {LoginComponent} from "./components/login/login.component";
import {ForgotComponent} from './components/forgot/forgot.component';
import {UpdatePassword} from './components/updatePassword/updatePassword';
@NgModule({
    imports: [
        CommonModule,
        DemoMaterialModule,
        FlexLayoutModule,
        ChartistModule,
        ChartsModule,
        FormsModule,
        NgApexchartsModule,
        RouterModule.forChild(LoginRoutes),
        ReactiveFormsModule
    ],
    declarations: [LoginComponent, ForgotComponent, UpdatePassword],
    providers:[AuthService, FormBuilder]
})
export class LoginModule { }
