import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-overview-example-dialog',
    template: `
<div mat-dialog-content>
    <p mat-dialog-title> 
        Are you sure to want to
        <strong>DELETE?</strong>
    </p>
    <p *ngIf="showField" >To proceed, type "DELETE". You wont be able to undo this.</p>
</div>
<div mat-dialog-actions>
<div fxFlex.gt-md="100" fxFlex="100">
<mat-form-field *ngIf="showField">
  <input  type="text" [(ngModel)]="txtValue" (change)="txtChange()"/>
  </mat-form-field>
  </div>
  <button mat-button *ngIf="txtValue=='DELETE' || !disableDel"  (click)="delete()" tabindex="2">Delete</button>
  <button mat-button  (click)="onNoClick()" tabindex="-1">Cancel</button>
</div>`
})
export class DeletepopupComponent {
    showField;
    txtValue;
    disableDel=false;
    constructor(
        public dialogRef: MatDialogRef<DeletepopupComponent>,
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
    delete(): void {
        
        this.data.service.delete(this.data.id, this.data.propid).subscribe((response: any) => {
            this.dialogRef.close();
            
                window.location.reload();
            
        });
    }
}
