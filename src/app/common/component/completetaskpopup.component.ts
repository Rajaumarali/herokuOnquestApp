import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-overview-example-dialog',
    template: `
<div mat-dialog-content>
    <p mat-dialog-title> 
        Are you sure to want to
        <strong>{{msg}}?</strong>
    </p>
    <p *ngIf="showField" >Type "{{${`confirmName`}}}" to {{msg}}. This cannot be undone.</p>
</div>
<div mat-dialog-actions>
<div fxFlex.gt-md="100" fxFlex="100">
<mat-form-field *ngIf="showField">
  <input matInput name="changeTxt"  type="text" [(ngModel)]="txtValue" (change)="txtChange()"/>
  </mat-form-field>
  </div>
  <button mat-button *ngIf="txtValue==confirmName || !disableDel"  (click)="change()" tabindex="2">Complete</button>
  <button mat-button  (click)="onNoClick()" tabindex="-1">Cancel</button>
</div>`
})
export class CompleteTaskPopup {
    showField;
    txtValue;
    disableDel=false;
    msg;
    confirmName;
    constructor(
        public dialogRef: MatDialogRef<CompleteTaskPopup>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.showField= this.data.showConfirmField;
        this.msg = this.data.message;
        if(this.showField==true){
            this.disableDel=true;
        }
        if(data.confirmName)
        this.confirmName = data.confirmName;
        else
            this.confirmName="COMPLETE";
        
    }
    onNoClick(): void {
        this.dialogRef.close("cancel");
        
    }
    txtChange(): void {
        console.log(this.txtValue);
        
    }
    change(): void {
        
        this.dialogRef.close(this.txtValue);
    }
}
