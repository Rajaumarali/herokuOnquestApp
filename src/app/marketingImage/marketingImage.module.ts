import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {ImgeditComponent} from "./components/imgedit/imgedit.component";
import {ImglistingComponent} from "./components/imglisting/imglisting.component";
import {FormBuilder, FormsModule} from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import {AuthService} from "../login/services/auth.service";
import {MyCommonModule} from "../common/common.module";
import {MarkrtingImageRouter} from './marketingImage.routing';
import {MarketingImageService} from './services/marketingImage.service';
import {ImgCreateComponent} from './components/imgCreate/imgCreate.component';
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
        MyCommonModule,
        RouterModule.forChild(MarkrtingImageRouter)
    ],
    declarations: [ImgeditComponent,ImglistingComponent,ImgCreateComponent],
    providers:[FormBuilder,MarketingImageService,AuthService]
})
export class MarketingImageModule { }
