import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-overview-example-dialog',
    template: `
<div mat-dialog-content>
    <h3 mat-dialog-title>Are you sure to want to DELETE?</h3>
<!--  <p>What's your favorite animal?</p>-->
</div>
<div mat-dialog-actions>
  <button mat-button (click)="delete()" tabindex="2">Delete</button>
  <button mat-button (click)="onNoClick()" tabindex="-1">Cancel</button>
</div>`
})
export class DeletepopupComponent {
    constructor(
        public dialogRef: MatDialogRef<DeletepopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    onNoClick(): void {
        this.dialogRef.close();
    }
    delete(): void {
        this.data.service.deleteRow(this.data.id).subscribe((response: any) => {
            this.dialogRef.close();
        });
    }
}
