import { Component, Inject, NgModule, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-dialog-overview-example-dialog',
  template: `
    <div mat-dialog-content>
    <div fxFlex.gt-md="100" fxFlex="100">
        <div fxLayout="row wrap">
            <div fxFlex.gt-sm="100" fxFlex.gt-xs="100" fxFlex="100">
                <mat-card>
                    <mat-card-content>
<!--                        <mat-card-title>All {{listType}}</mat-card-title>-->
                        <span *ngIf="loader" style="position: relative;width: 5%; left: 45%" class="p-a"><img src="assets/images/loader.gif" alt="homepage" width="40px" class="dark-logo m-l-10"></span>
                        <div class="responsive-table">
                            <mat-table [dataSource]="dataSource" matSort>

                            <ng-container matColumnDef="service_name">
                            <mat-header-cell *matHeaderCellDef mat-sort-header class="m-r-10">Service Name </mat-header-cell>
                            <mat-cell *matCellDef="let row;let i = index;" class="m-r-10 cursor-p" (click)="detail(row)" >
                              {{row.service_name}}
                            </mat-cell>
                          </ng-container>
            
                          <ng-container matColumnDef="captain">
                            <mat-header-cell *matHeaderCellDef mat-sort-header class="m-r-10">Captain </mat-header-cell>
                            <mat-cell *matCellDef="let row;let i = index;" class="m-r-10 cursor-p" (click)="detail(row)" >
                               {{row.captain}}
                            </mat-cell>
                          </ng-container>
              
                          <ng-container matColumnDef="property_name">
                            <mat-header-cell *matHeaderCellDef mat-sort-header class="m-w-250 m-r-10"> Property Name</mat-header-cell>
                            <mat-cell *matCellDef="let row;let i = index;" class="cursor-p m-w-250 m-r-10" (click)="detail(row)" > {{row.property_name}} </mat-cell>
                          </ng-container>
              
                          <ng-container matColumnDef="resident">
                            <mat-header-cell *matHeaderCellDef mat-sort-header class="m-r-10"> Resident Name </mat-header-cell>
                            <mat-cell *matCellDef="let row;let i = index;" class="cursor-p m-r-10" (click)="detail(row)" > {{row.resident}} </mat-cell>
                          </ng-container>
              
                          <ng-container matColumnDef="user_profile_service_day">
                            <mat-header-cell *matHeaderCellDef mat-sort-header class="m-r-10"> Service Day </mat-header-cell>
                            <mat-cell *matCellDef="let row;let i = index;" class="cursor-p m-r-10" (click)="detail(row)" > {{row.user_profile_service_day }}</mat-cell>
                          </ng-container>
              
                          <ng-container matColumnDef="status">
                            <mat-header-cell *matHeaderCellDef mat-sort-header class="m-r-10"> Status </mat-header-cell>
                            <mat-cell *matCellDef="let row;let i = index;"  class="m-r-10 cursor-p" (click)="detail(row)"> {{row.status}}</mat-cell>
                          </ng-container>

                          <ng-container matColumnDef="responsible_party">
                            <mat-header-cell *matHeaderCellDef mat-sort-header class="m-r-10"> Responsible Party </mat-header-cell>
                            <mat-cell *matCellDef="let row;let i = index;"  class="m-r-10 cursor-p" (click)="detail(row)"> {{row.responsible_party}}</mat-cell>
                          </ng-container>
              
                          <ng-container matColumnDef="created_at">
                            <mat-header-cell *matHeaderCellDef mat-sort-header class="m-r-10"> Created At </mat-header-cell>
                            <mat-cell *matCellDef="let row;let i = index;" class="cursor-p m-r-10" (click)="detail(row)" > {{row.created_at | slice:0:10}} </mat-cell>
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
export class TaskListStatusComponent {
  msg: string;
  @ViewChild('form') profileForm: NgForm;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = ['service_name', 'resident', 'property_name', 'captain', 'status', 'created_at', 'user_profile_service_day'];
  dataSource;
  listType = "";
  allUsers = [];
  services = [];
  captains = [];
  services_enable = [];
  allTasks = [];
  loader: any = true;
  constructor(
    public dialogRef: MatDialogRef<TaskListStatusComponent>,
    public snackBar: MatSnackBar,
    private router: Router,
    breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    breakpointObserver.observe(['(max-width: 1000px)']).subscribe(result => {

      this.displayedColumns = result.matches ?
        ['service_name', 'resident', 'property_name', 'captain', 'status','responsible_party', 'created_at', 'user_profile_service_day'] :
        ['service_name', 'resident', 'property_name', 'captain', 'status','responsible_party', 'created_at', 'user_profile_service_day'];

    });
    this.allTasks = data.list;
    this.captains = data.captains;
    this.dataSource = new MatTableDataSource<any>(this.allTasks);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort;
    });

    this.loader = false;


  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  detail(row) {
    this.dialogRef.close();
    localStorage.setItem('task', JSON.stringify(row));
    this.router.navigate(['/tasks/' + 2 + '/view']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
