import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ServiceService} from '../../services/service.service';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {DeletepopupComponent} from "../../../common/component/deletepopup.component";


@Component({
  selector: 'app-servicelisting',
  templateUrl: './servicelisting.component.html',
  styleUrls: ['./servicelisting.component.css']
})

export class ServicelistingComponent implements OnInit {

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns = ['service_name', 'service_restriction_type_id','criteria','action'];
    allRestrictedService:any = [];
    dataSource;
    userType;

    constructor(public dialog: MatDialog,private router: Router , private service: ServiceService ,private breakpointObserver: BreakpointObserver) {
        this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
        breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
            if (this.userType == '5' || this.userType == '4' || this.userType == '6') {
      this.displayedColumns = result.matches ?
          ['service_name', 'service_restriction_type_id','criteria','action'] :
          ['service_name', 'service_restriction_type_id','criteria','action'];
            }else{
                this.displayedColumns = result.matches ?
          ['service_name', 'service_restriction_type_id','criteria'] :
          ['service_name', 'service_restriction_type_id','criteria'];
            }
    });
      this.getAllRestrictedService();
    }
    ngOnInit() {}
    getAllRestrictedService() {
        const serviceName = localStorage.getItem( 'serValue');
        this.service.getAllRestrictedService().subscribe((response: any) => {
            if (serviceName != '') {
                this.allRestrictedService = response.filter(item => item.service_name == serviceName);
            } else {
                this.allRestrictedService = response;
            }
            this.dataSource = new MatTableDataSource<any>(this.allRestrictedService);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }
    applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
    }

    /*delete(id) {
       this.service.deleteRestrictedService(id).subscribe((response: any) => {
        });
    }*/
    btnClick(btntype) {
        this.router.navigate(['/restrictedservices/' + btntype + '/edit']);
    }
    btnCreate(){
        this.router.navigate(['/restrictedservices/create']);
    }

    openDialog(id): void {
        const dialogRef = this.dialog.open(DeletepopupComponent, {
            width: '400px',
            data: {id:  id, service: this.service}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllRestrictedService();
        });
    }
}
