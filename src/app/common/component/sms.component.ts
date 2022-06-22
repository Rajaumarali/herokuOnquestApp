import { Component,Inject, NgModule } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
    selector: 'app-dialog-overview-example-dialog',
    template: `
    <h1 mat-dialog-title>Please Enter Message.</h1>
<!--    <div mat-dialog-content>-->
<!--      <div fxFlex.gt-md="100" fxFlex="100">-->
<!--                            <mat-form-field>-->
<!--                                <input matInput placeholder="Enter Subject" >-->
<!--                            </mat-form-field>-->
<!--                        </div>-->
<!--    </div>-->
    <div mat-dialog-content>
    <div fxFlex.gt-md="100" fxFlex="100">
    <mat-form-field>
        <input matInput placeholder="Enter Message" [(ngModel)]="msg">
    </mat-form-field>
</div>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="sms()" tabindex="2">Send</button>
      <button mat-button (click)="onNoClick()"  tabindex="-1">Close</button>
      <span *ngIf="loader" class="p-a"><img src="assets/images/loader.gif" alt="homepage" width="40px" class="dark-logo m-l-10"></span>
    </div>`
})
export class SMSComponent {
    msg: string;
    loader: any = false;
    constructor(
        public dialogRef: MatDialogRef<SMSComponent>,
        public snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    onNoClick(): void {
        this.dialogRef.close();
    }
    sms(): void {
        this.data.phone = "+1"+this.data.phone;
        this.loader = true;
        this.data.service.smsSend(this.data.name,this.data.user_id,this.data.phone,this.msg).subscribe((response: any) => {
            this.dialogRef.close();
            this.loader = false;
            if(response.status !== 'failed')
                this.openSnackBar('Successfully sent your message', '');
            else
                this.openSnackBar('An error occurred! Please try again later.', '');
        });
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 5000
        });
    }
}
