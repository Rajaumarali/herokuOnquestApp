import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ResidentService} from '../../services/resident.service';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { MatDialog } from '@angular/material/dialog';
import { DeletepopupComponent } from '../../../common/component/deletepopup.component';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-resident',
    templateUrl: './residentlisting.component.html',
    styleUrls: ['./residentlisting.component.css']
})

export class ResidentlistingComponent implements OnInit {
    myControl = new FormControl();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('selectList', { static: false }) selectList: ElementRef;
    
    displayedColumns = ['id', 'first_name', 'property_name', 'unit_number','user_profile_service_day','email','phone','Action'];
    allResidentUsers = [];
    allbuilding = [];
    allbuildingfilter = [];
    selectedProperty = '';
    dataSource;
    userType;
    filterText;
    alertMessage="";
    // checked=true;
    propertyDropdown=true;
  constructor(public dialog: MatDialog,private router: Router , private residentService: ResidentService ,breakpointObserver: BreakpointObserver) {
      this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
       
      $('.page-title').text('All Residents');

    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
        if (this.userType == '5' || this.userType == '4' || this.userType == '3' || this.userType == '6' ) {
            this.displayedColumns = result.matches ?
                ['first_name', 'property_name', 'unit_number', 'user_profile_service_day', 'email', 'phone', 'Action'] :
                ['first_name', 'property_name', 'unit_number', 'user_profile_service_day', 'email', 'phone', 'Action'];
        }else {
            this.displayedColumns = result.matches ?
                ['first_name', 'property_name', 'unit_number', 'user_profile_service_day', 'email', 'phone'] :
                ['first_name', 'property_name', 'unit_number', 'user_profile_service_day', 'email', 'phone'];
        }

    });
    
  }
    ngOnInit() {
        
     this.residentService.getAllLocations().subscribe((response: any) => {
        if(this.userType=="3"){
            var building = JSON.parse(localStorage.getItem("user")).building_id;
            var findProp = response.filter(item=> item.property_code==building)
                if(findProp){
                    this.allbuildingfilter = findProp;
                    this.allbuilding = findProp;
                }
        }else if(this.userType == '6'){
            let region = JSON.parse(localStorage.getItem("user")).user_region;
            this.allbuildingfilter = response.filter(item => item.region == region);
            this.allbuilding = this.allbuildingfilter;
            
        }else{
         this.allbuildingfilter = response;
         this.allbuilding = response;
        }
    });
    this.getAllResidents();
    }
    getAllResidents() {
      this.residentService.getAllResidents().subscribe((response: any) => {
        if(this.userType=="3"){
            var building = JSON.parse(localStorage.getItem("user")).building_id;
            var findMatch = response.filter(item => item.building_id==building)
            response = findMatch;
        }else if(this.userType == '6'){
            var findAllResi = response.filter(item => {
                var findMatchResi = this.allbuildingfilter.find(itemProp => itemProp.property_code == item.building_id);
                if(findMatchResi)
                  return item;
              })
              response = findAllResi;
        }
          this.allResidentUsers = response.map(item => {
              let it = {...item,user_profile_service_day: item.user_profile_service_day == '1' ? 'Monday' : item.user_profile_service_day == '2' ? 'Tuesday' : item.user_profile_service_day == '3' ? 'Wednesday' : item.user_profile_service_day == '4' ? 'Thursday' : item.user_profile_service_day == '5' ? 'Friday' : item.user_profile_service_day == '6' ? 'Saturday' : item.user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' }
                return it;
            });
            
          this.dataSource = new MatTableDataSource<any>(this.allResidentUsers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.propertyDropdown=false;
          this.dataSource.filterPredicate = function(data, filter: string): boolean {
            return data.first_name.toLowerCase().includes(filter)||data.last_name.toLowerCase().includes(filter) || data.property_name.toLowerCase().includes(filter) || data.unit_number.toString().includes(filter)
            || data.user_profile_service_day.toLowerCase().includes(filter)|| data.email.toLowerCase().includes(filter)|| data.phone.toString().includes(filter);
        };
        },err=> {
            this.dataSource = new MatTableDataSource<any>(this.allResidentUsers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.propertyDropdown=false;
          this.alertMessage = "No result found";
        });

  }
  getPhone = function(phone){
    if(phone!=null){
        phone = phone.replace("+1","");
        phone = phone.replace("+92","");
        return phone.replace(/^(\d{3})(\d{3})/, "$1-$2-");
        }
        return "N/A";
};
    onChange(prop) {
        if(prop == "All"){
            this.propertyDropdown=true;
            this.getAllResidents();
            
        }else{
            var findPropCode = this.allbuildingfilter.find(item=> item.property_name==prop).property_code;
            this.selectedProperty = findPropCode;
            this.propertyDropdown=true;
            this.residentService.getAllUsers({
                'user_type': 'resident',
                'property_code': findPropCode
            }).subscribe((response: any) => {
                this.allResidentUsers = response.map(item => {
                    let it = {...item,user_profile_service_day: item.user_profile_service_day == '1' ? 'Monday' : item.user_profile_service_day == '2' ? 'Tuesday' : item.user_profile_service_day == '3' ? 'Wednesday' : item.user_profile_service_day == '4' ? 'Thursday' : item.user_profile_service_day == '5' ? 'Friday' : item.user_profile_service_day == '6' ? 'Saturday' : item.user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' }
                      return it;
                  });
                this.alertMessage = "";
                this.dataSource = new MatTableDataSource<any>(this.allResidentUsers);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.propertyDropdown=false;
            },err => {
                const bakingServices = [];
                this.dataSource = new MatTableDataSource<any>(bakingServices);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.alertMessage = err.error.message;
                this.propertyDropdown = false; 
              },);
        }
    }
    btnedit(btntype) {
            this.router.navigate(['/residents/' + btntype + '/edit']);
    }
    detail(uerId) {
        this.router.navigate(['/residents/' + uerId + '/view']);
    }
    btnCreate() {
        this.router.navigate(['/residents/create']);
    }
    filterItem(event){
        if (!event) {
            this.allbuilding = this.allbuildingfilter;
          } // when nothing has typed*/   
          if (typeof event.value === 'string') {
            this.allbuilding = this.allbuildingfilter.filter(a => a.property_name.toLowerCase()
              .startsWith(event.value.toLowerCase()));
          }
        //   this.selectList.nativeElement.size = this.allbuilding.length + 1;
    }
    applyFilter(filterValue: string) {
    //   filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches      
      this.dataSource.filter = filterValue;
    }
    openDialog(id): void {
        const dialogRef = this.dialog.open(DeletepopupComponent, {
            width: '400px',
            data: {id:  id, service: this.residentService, showConfirmField: true}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllResidents();
        });
    }
}


