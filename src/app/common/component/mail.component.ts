import { Component,Inject, NgModule } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-dialog-overview-example-dialog',
    template: `
    <h1 mat-dialog-title>Please Enter Subject and Message.</h1>
    <div mat-dialog-content>
      <div fxFlex.gt-md="100" fxFlex="100">
                            <mat-form-field>
                                <input matInput placeholder="Enter Subject" [(ngModel)]="sub">
                            </mat-form-field>
                        </div>
    </div>
    <div mat-dialog-content>
    <div fxFlex.gt-md="100" fxFlex="100">
    <mat-form-field>
        <input matInput placeholder="Enter Message" [(ngModel)]="msg">
    </mat-form-field>
</div>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="email()" tabindex="2">Send</button>
      <button mat-button (click)="onNoClick()"  tabindex="-1">Close</button>
    </div>`
})
export class MailComponent {
    msg: string;
    sub: string;
    constructor(
        public dialogRef: MatDialogRef<MailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    onNoClick(): void {
        this.dialogRef.close();
    }
    email(): void {
        this.data.service.emailSend('Hi '+this.data.fname+",","",this.sub,this.data.email,this.msg+'\n\nYour OnQuest Support Team').subscribe((response: any) => {
            this.dialogRef.close();
        });
    }
}
