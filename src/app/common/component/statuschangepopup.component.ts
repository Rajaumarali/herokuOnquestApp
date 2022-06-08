import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-overview-example-dialog',
    template: `
<div mat-dialog-content>
    <p mat-dialog-title> 
        Are you sure to want to
        <strong>change active status?</strong>
    </p>
    <p *ngIf="showField" >Type "CHANGE" to change the property avtive status.</p>
</div>
<div mat-dialog-actions>
<div fxFlex.gt-md="100" fxFlex="100">
<mat-form-field *ngIf="showField">
  <input matInput name="changeTxt"  type="text" [(ngModel)]="txtValue" (change)="txtChange()"/>
  </mat-form-field>
  </div>
  <button mat-button *ngIf="txtValue=='CHANGE' || !disableDel"  (click)="change()" tabindex="2">Change</button>
  <button mat-button  (click)="onNoClick()" tabindex="-1">Cancel</button>
</div>`
})
export class StatusChangepopupComponent {
    showField;
    txtValue;
    disableDel=false;
    constructor(
        public dialogRef: MatDialogRef<StatusChangepopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.showField= this.data.showConfirmField;
        if(this.showField==true){
            this.disableDel=true;
        }
    }
    onNoClick(): void {
        this.dialogRef.close();
        
    }
    txtChange(): void {
        console.log(this.txtValue);
        
    }
    change(): void {
        
        this.data.service.updateLocation(this.data.row).subscribe((response: any) => {
            this.dialogRef.close();
            
               
            
        });
    }
}
