import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-overview-example-dialog',
    template: `
<div mat-dialog-content>
    <p mat-dialog-title> 
        Are you sure to want to
        <strong>Log Out?</strong>
    </p>
</div>
<div mat-dialog-actions>
  <button mat-button (click)="logout()" tabindex="2">Log Out</button>
  <button style="margin-left:10px;" mat-button  (click)="onNoClick()" tabindex="-1">Cancel</button>
</div>`,
styleUrls: ['./logoutpopup.component.scss']
})
export class LogoutpopupComponent {
    
    constructor(
        public dialogRef: MatDialogRef<LogoutpopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        
    }
    onNoClick(): void {
        this.dialogRef.close();
        
    }
    logout(): void {
        localStorage.removeItem('residentListing');
        localStorage.removeItem('tasksListing');
        localStorage.removeItem("user");
        this.data.router.navigate(['/login']);
        this.dialogRef.close();
    }
}
