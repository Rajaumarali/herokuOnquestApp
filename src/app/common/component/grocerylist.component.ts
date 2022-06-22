import {Component, Inject, NgModule, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import {FormsModule, NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatTableDataSource} from '@angular/material/table';
@Component({
    selector: 'app-dialog-overview-example-dialog',
    template: `
    <h1 mat-dialog-title>Grocery List.</h1>
    <div mat-dialog-content>
    <div fxFlex.gt-md="100" fxFlex="100">
        <div fxLayout="row wrap">
            <div fxFlex.gt-sm="100" fxFlex.gt-xs="100" fxFlex="100">
                <mat-card>
                    <mat-card-content>
<!--                        <mat-card-title>All Message Logs</mat-card-title>-->
                        <span *ngIf="loader" style="position: relative;width: 5%; left: 45%" class="p-a"><img src="assets/images/loader.gif" alt="homepage" width="40px" class="dark-logo m-l-10"></span>
                        <div class="responsive-table">
                            <mat-table [dataSource]="dataSource" matSort>

                                <ng-container matColumnDef="name">
                                    <mat-header-cell *matHeaderCellDef mat-sort-header class="m-w-250"> Item Name </mat-header-cell>
                                    <mat-cell *matCellDef="let row" class="m-w-250 cursor-p" >
                                        <span class="header-label"> Item Name:</span>
                                        <h5 class="m-0">{{row.name}}</h5>
                                    </mat-cell>
                                </ng-container>

                                <!-- Name Column -->
                                <ng-container matColumnDef="quantity">
                                    <mat-header-cell *matHeaderCellDef mat-sort-header> Quantity</mat-header-cell>
                                    <mat-cell *matCellDef="let row" class="cursor-p" > {{row.quantity}} </mat-cell>
                                </ng-container>

                                <!-- Color Column -->
                                <ng-container matColumnDef="image">
                                    <mat-header-cell *matHeaderCellDef mat-sort-header> Image </mat-header-cell>
                                    <mat-cell *matCellDef="let row" class="cursor-p" >
                                        <img *ngIf="row.image != ''" src="{{row.image}}" class="img-circle m-r-10" width="40" height="40"/>
                                    </mat-cell>
                                </ng-container>

                                <!-- Color Column -->
                                <ng-container matColumnDef="comment">
                                    <mat-header-cell *matHeaderCellDef mat-sort-header class="m-w-250"> Comment </mat-header-cell>
                                    <mat-cell *matCellDef="let row" class="m-w-250 cursor-p"> {{row.comment}} </mat-cell>
                                </ng-container>

                                <!-- Color Column -->
                                <ng-container matColumnDef="created_at">
                                    <mat-header-cell *matHeaderCellDef mat-sort-header> Created At </mat-header-cell>
                                    <mat-cell *matCellDef="let row" class="cursor-p" > {{row.created_at | date:'medium'}} </mat-cell>
                                </ng-container>



                                <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
                                <mat-row *matRowDef="let row; columns: displayedColumns;">
                                </mat-row>
                            </mat-table>

                            <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]"></mat-paginator>
                        </div>
                    </mat-card-content>
                </mat-card>
            </div>
        </div>

    </div>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()"  tabindex="-1">Close</button>
    </div>`
})
export class GrocerylistComponent {
    msg: string;
    @ViewChild('form') profileForm: NgForm;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns = ['id', 'name', 'quantity', 'image', 'comment', 'created_at'];
    dataSource;
    user_id;
    allMessagesLogs = [];
    loader: any = true;
    constructor(
        public dialogRef: MatDialogRef<GrocerylistComponent>,
        public snackBar: MatSnackBar,
        breakpointObserver: BreakpointObserver,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        breakpointObserver.observe(['(max-width: 1000px)']).subscribe(result => {

            this.displayedColumns = result.matches ?
                ['name', 'quantity', 'image', 'comment', 'created_at'] :
                ['name', 'quantity', 'image', 'comment', 'created_at'];

        });

        this.getList();
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    getList(): void {
        this.data.service.getGroceryList(this.data.id).subscribe((resp: any) => {
            this.allMessagesLogs = resp;
            this.dataSource = new MatTableDataSource<any>(this.allMessagesLogs);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.loader = false;
        });
    }
    // sms(): void {
    //     this.loader = true;
    //     this.data.service.smsSend(this.data.name,this.data.user_id,this.data.phone,this.msg).subscribe((response: any) => {
    //         this.dialogRef.close();
    //         this.loader = false;
    //         if(response.status !== 'failed')
    //             this.openSnackBar('Successfully sent your message', '');
    //         else
    //             this.openSnackBar('An error occurred! Please try again later.', '');
    //     });
    // }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 5000
        });
    }
}
