import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { LocationService } from '../../services/location.service';
import {MatDialog} from "@angular/material/dialog";
import {DeletepopupComponent} from "../../../common/component/deletepopup.component";
import { StatusChangepopupComponent } from '../../../common/component/statuschangepopup.component';

@Component({
    selector: 'app-locations',
    templateUrl: './locationlisting.component.html',
    styleUrls: ['./locationlisting.component.css']
})

export class LocationListingComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns = ['property_name', 'property_code', 'management_company', 'address_line1','address_line2','address_city','address_zip','active','action'];
    dataSource;
    userType;
    property_code;
    locations = [];
    constructor(public dialog: MatDialog,private router: Router , private service: LocationService ,breakpointObserver: BreakpointObserver) {
        this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
    $('.page-title').text('All Properties');
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
            if (this.userType == '5'  ) {
                this.displayedColumns = result.matches ?
                    ['property_name', 'property_code', 'management_company', 'address_line1','region','address_city','address_zip','active','action'] :
                    ['property_name', 'property_code', 'management_company', 'address_line1','region','address_city','address_zip','active','action'];
            }else if(this.userType == '4' || this.userType == '3' || this.userType == '6' ){
                this.displayedColumns = result.matches ?
                ['property_name', 'property_code', 'management_company', 'address_line1','region','address_city','address_zip','action'] :
                ['property_name', 'property_code', 'management_company', 'address_line1','region','address_city','address_zip','action'];
            } 
            else{
                this.displayedColumns = result.matches ?
                    ['property_name', 'property_code', 'management_company', 'address_line1','region','address_city','address_zip'] :
                    ['property_name', 'property_code', 'management_company', 'address_line1','region','address_city','address_zip'];
            }

        });
        this.getAllLocations();
    }
    ngOnInit() {}
    getAllLocations(){
        
        this.service.getAllLocations().subscribe((response: any) => {
            console.log(response);
            if (this.userType == '3' ) {
                this.property_code = JSON.parse(localStorage.getItem("user")).building_id;
                console.log(this.property_code);
                
                var findProp = response.filter(item=> item.property_code==this.property_code)
                if(findProp)
                this.locations = findProp;
            }else if(this.userType=='6'){
                let region = JSON.parse(localStorage.getItem("user")).user_region;
                this.locations = response.filter(item => item.region == region);
            }else
            this.locations = response;
            this.dataSource = new MatTableDataSource<any>(this.locations);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

/*    delete(building_id) {
        this.service.delete(building_id).subscribe((response: any) => {
            this.getAllLocations();
        });
    }*/
    changeStatus(row){
        console.log(row);
        
        if(row.active=="true"){
            row.active="false";
        }else{
            row.active="true";
        }
        const dialogRef = this.dialog.open(StatusChangepopupComponent, {
            width: '400px',
            data: {row:row, service: this.service, showConfirmField: true}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllLocations();
        });
    }
    editbtn(propertycode) {
        this.router.navigate(['/properties/' + propertycode + '/edit']);
    }
    detail(row){
        localStorage.setItem('task',JSON.stringify(row));
        this.router.navigate(['/properties/' + 0 + '/view']);
    }
    btnCreate(){
        this.router.navigate(['/properties/create']);
    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
    openProperty(row){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['property',row.property_code]);
        });
    }
    openDialog(bid, propid): void {
        const dialogRef = this.dialog.open(DeletepopupComponent, {
            width: '400px',
            data: {id:  bid,propid:propid, service: this.service, showConfirmField: true}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllLocations();
        });
    }




}
