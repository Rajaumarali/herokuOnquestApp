import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ServiceService} from '../../services/service.service';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DeletepopupComponent} from "../../../common/component/deletepopup.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-servicelisting',
  templateUrl: './servicelisting.component.html',
  styleUrls: ['./servicelisting.component.css']
})
export class ServicelistingComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns = ['id', 'service_name', 'service_image','service_type'];
    allResidentUsers = [];
    allbuilding = [];
    selectedProperty = '';
    dataSource;
    userType;
  constructor(public dialog: MatDialog,private router: Router , private service: ServiceService ,private breakpointObserver: BreakpointObserver) {
    this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
    $('.page-title').text('All Services');
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      if (this.userType == '5' || this.userType == '4'){
        this.displayedColumns = result.matches ?
          [ 'service_image', 'service_name', 'service_type', 'Action'] :
          [ 'service_image', 'service_name', 'service_type', 'Action'];
      }else{
        this.displayedColumns = result.matches ?
          [ 'service_image', 'service_name', 'service_type'] :
          [ 'service_image', 'service_name', 'service_type'];
      }
    });
    this.getAllServices();
  }
    ngOnInit() {}
    getAllServices() {
      this.service.getAllServices().subscribe((response: any) => {
          this.allResidentUsers = response;
          this.dataSource = new MatTableDataSource<any>(this.allResidentUsers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });

  }
    onChange() {
        this.service.getAllUsers({
            'user_type': 'resident',
            'property_code': this.selectedProperty
        }).subscribe((response: any) => {
            this.allResidentUsers = response;
            this.dataSource = new MatTableDataSource<any>(this.allResidentUsers);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });

    }
    btnClick(btntype) {
            this.router.navigate(['/services/' + btntype + '/edit']);
    }
    detail(uerId) {
        this.router.navigate(['/services/' + uerId + '/view']);
    }
    applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
    }
    btnRestrictedSeervice(){
        this.router.navigate(['/restrictedservices/']);
    }

    openDialog(id): void {
        const dialogRef = this.dialog.open(DeletepopupComponent, {
            width: '400px',
            data: {id:  id, service: this.service, showConfirmField: true}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllServices();
        });
    }

}
