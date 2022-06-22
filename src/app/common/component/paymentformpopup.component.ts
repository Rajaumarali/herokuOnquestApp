import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-overview-example-dialog',
    template: `
<div mat-dialog-content>
    <p mat-dialog-title> 
        <strong>Fill out the form</strong>
    </p>
</div>
<div mat-dialog-actions>
<div style="display:flex" fxFlex.gt-md="100" fxFlex="100">
    <label for="input-file-id" class="md-button md-raised md-primary">Choose Invoice</label>
    <p>{{filesCount}} files selected</p>
  <input class="ng-hide" id="input-file-id" multiple type="file" (change)="fileProgress($event)"/>
  </div>
  <div style=" margin-top:20" fxFlex.gt-md="100" fxFlex="100">
  <mat-form-field>
  <input matInput name="changeTxt" placeholder="Enter Total Amount E.g 1.56" type="text" [(ngModel)]="txtValue" (change)="txtChange()"/>
  </mat-form-field>
  </div>
  <button mat-button  (click)="change()" tabindex="2">Confirm</button>
  <button mat-button  (click)="onNoClick()" tabindex="-1">Cancel</button>
</div>`,
styleUrls: ['./paymentformpopup.component.scss']
})
export class PaymentFormPopup {
    showField;
    txtValue;
    disableDel=false;
    fileData: File = null;
    filesCount=0;
    previewUrl = [];
    constructor(
        public dialogRef: MatDialogRef<PaymentFormPopup>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.showField= this.data.showConfirmField;
        if(this.showField==true){
            this.disableDel=true;
        }
    }
    onNoClick(): void {
        this.dialogRef.close("cancel");
        
    }
    txtChange(): void {
        console.log(this.txtValue);
        
    }
    change(): void {
        var dataReturn = {fileData:this.fileData, fileCount:this.filesCount , txt:this.txtValue}
        this.dialogRef.close(dataReturn);
    }
    fileProgress(fileInput: any) {
        this.fileData = <File>fileInput.target.files;
        // this.preview();
        var fileList = [];

        this.filesCount = fileInput.target.files.length;
        
        
    }
   
}
