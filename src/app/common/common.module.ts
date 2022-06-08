import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {FormBuilder, FormsModule} from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import {DeletepopupComponent} from "./component/deletepopup.component";
import { MailComponent } from './component/mail.component';
import {SMSComponent} from './component/sms.component';
import {GrocerylistComponent} from './component/grocerylist.component';
import { StatusChangepopupComponent } from './component/statuschangepopup.component';
import { CompleteTaskPopup } from './component/completetaskpopup.component';
import { PaymentFormPopup } from './component/paymentformpopup.component';
import { UserlistComponent } from './component/userList.component';
import { TaskListStatusComponent } from './component/taskListStatus';



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
    ],
    declarations: [DeletepopupComponent, MailComponent,TaskListStatusComponent, SMSComponent, GrocerylistComponent, UserlistComponent, StatusChangepopupComponent, CompleteTaskPopup, PaymentFormPopup],
    providers:[FormBuilder]
})
export class MyCommonModule { }
