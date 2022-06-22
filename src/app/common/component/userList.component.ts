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
    <h1 mat-dialog-title>All {{userType}}</h1>
    <div mat-dialog-content>
    <div fxFlex.gt-md="100" fxFlex="100">
        <div fxLayout="row wrap">
            <div fxFlex.gt-sm="100" fxFlex.gt-xs="100" fxFlex="100">
                <mat-card>
                    <mat-card-content>
<!--                        <mat-card-title>All {{userType}}</mat-card-title>-->
                        <span *ngIf="loader" style="position: relative;width: 5%; left: 45%" class="p-a"><img src="assets/images/loader.gif" alt="homepage" width="40px" class="dark-logo m-l-10"></span>
                        <div class="responsive-table">
                            <mat-table [dataSource]="dataSource" matSort>

                                <ng-container matColumnDef="name">
                                    <mat-header-cell *matHeaderCellDef mat-sort-header class="m-w-250"> Item Name </mat-header-cell>
                                    <mat-cell *matCellDef="let row" class="m-w-250 cursor-p" >
                                        <span class="header-label"> Item Name:</span>
                                        <h5 class="m-0">{{row.first_name}} {{row.last_name}}</h5>
                                    </mat-cell>
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
export class UserlistComponent {
    msg: string;
    @ViewChild('form') profileForm: NgForm;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns = [ 'name',];
    dataSource;
    userType="";
    allUsers = [];
    services = [];
    services_enable =[];
    allRestrictedServices=[];
    loader: any = true;
    constructor(
        public dialogRef: MatDialogRef<UserlistComponent>,
        public snackBar: MatSnackBar,
        breakpointObserver: BreakpointObserver,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {

        breakpointObserver.observe(['(max-width: 1000px)']).subscribe(result => {

            this.displayedColumns = result.matches ?
                ['name'] :
                ['name'];

        });
        this.userType= this.data.userType;
        if(this.userType!="Captains" && this.userType!="Services"){
            data.service.getUsers().subscribe(res=> {
                if(this.userType=="Basic User")
                    this.allUsers = res.filter(item => item.user_type_id==3 && item.property_code==data.property_code);
                else if(this.userType=="Regional Admin")
                    this.allUsers = res.filter(item => item.user_type_id=="6" && item.user_region==data.region);
                
                    
                    // this.allUsers = this.data.allUsers;
                    this.dataSource = new MatTableDataSource<any>(this.allUsers);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.loader = false;
            })
        }else if(this.userType=="Captains"){
            data.service.getAllCaptains().subscribe(res=> {
                    this.allUsers = res.filter(item => {
                    var additionaBuild:any;
                    var findAddBuild = undefined;
                    if(item.additional_building!==null && item.additional_building!=="null"){
                      additionaBuild = item.additional_building.split(",");
                      findAddBuild = additionaBuild.find(ite => ite == data.property_code)
                    }
                    if(item.property_code==data.property_code || findAddBuild)
                      return item;
                  })
                  this.dataSource = new MatTableDataSource<any>(this.allUsers);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  this.loader = false;
            });
        }else if(this.userType=="Services"){
            this.getAllServices();
        }  
        
    }

    getAllServices() {

        this.data.service.allServices().subscribe((response: any) => {
            response.map((item, index) => {
                this.services.push({ value: index, service: item.service_name, id: item.id, type: item.service_type });
            });
            
            this.getRestrictedServices();
        });

    }

    getRestrictedServices() {

        this.data.service.getAllRestrictedService().subscribe((response: any) => {
             this.allRestrictedServices = response.filter(item => item.criteria == this.data.property_code);
            this.services.map(itemR => {
                var findRestrictedService = this.allRestrictedServices.find(item => itemR.id == item.service_id);
                if (findRestrictedService == undefined)
                    this.services_enable.push({first_name:itemR.service,last_name:""});

            })
            
            this.dataSource = new MatTableDataSource<any>(this.services_enable);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.loader = false;

        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
   
   
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 5000
        });
    }
}
