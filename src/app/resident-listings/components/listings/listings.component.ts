import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { ResidentlistingService } from "../../services/residentlisting.service";
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  myControl = new FormControl();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns = ['id', 'first_name', 'property_name', 'unit_number','user_profile_service_day','email','phone','Action'];
    allResidentUsers = [];
    allResidentUsersfilter = [];
    allbuilding = [];
    allbuildingfilter = [];
    selectedProperty = '';
    dataSource;
    userType='';
    alertMessage='';
    propertyDropdown=false;
  constructor(private router: Router , private service: ResidentlistingService ,breakpointObserver: BreakpointObserver) {
    this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
    let screenName = localStorage.getItem('screenName');
      if(screenName)
      $('.page-title').text(screenName);
      else
      $('.page-title').text('Residents');
      localStorage.removeItem('screenName');
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
      [ 'first_name', 'property_name', 'unit_number','user_profile_service_day','email','phone','Action'] :
      [ 'first_name', 'property_name', 'unit_number','user_profile_service_day','email','phone','Action'];
    });
  }
    ngOnInit() {
      this.allResidentUsers = JSON.parse(localStorage.getItem('residentListing'));
      this.allResidentUsersfilter = JSON.parse(localStorage.getItem('residentListing'));
      console.log(this.allResidentUsers);
      
      this.dataSource = new MatTableDataSource<any>(JSON.parse(localStorage.getItem('residentListing')));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.first_name.toLowerCase().includes(filter)||data.last_name.toLowerCase().includes(filter) || data.property_name.toLowerCase().includes(filter) || data.unit_number.toString().includes(filter)
        || data.user_profile_service_day.toLowerCase().includes(filter)|| data.email.toLowerCase().includes(filter)|| data.phone.toString().includes(filter);
    };
      this.service.getAllLocations().subscribe((response: any) => {
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
            console.log(this.allbuilding);
            
        }else{
         this.allbuildingfilter = response;
         this.allbuilding = response;
        }
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
    btnClick(btntype) {
            this.router.navigate(['/residents/' + btntype + '/edit']);
    }
    detail(index) {
    // localStorage.setItem('task', JSON.stringify(index));
    this.router.navigate(['/residents/' + index + '/view']);
    }
    applyFilter(filterValue: string) {
      // filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
    }
    filterItem(event){
      if (!event) {
          this.allbuilding = this.allbuildingfilter;
        } // when nothing has typed*/   
        if (typeof event === 'string') {
          console.log(event);
          console.log(this.allbuildingfilter);
          this.allbuilding = this.allbuildingfilter.filter(a => a.property_name.toLowerCase()
            .startsWith(event.toLowerCase()));
        }
        console.log(this.allbuilding.length);
      //   this.selectList.nativeElement.size = this.allbuilding.length + 1;
  }
  onChange(prop) {
    if(prop == "All"){
        this.propertyDropdown=true;
        this.allResidentUsers =this.allResidentUsersfilter
        this.dataSource = new MatTableDataSource<any>(this.allResidentUsers);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.propertyDropdown=false;
    }else{
        
        this.propertyDropdown=true;
        this.allResidentUsers = this.allResidentUsersfilter.filter(item => item.property_name==prop);
        if(this.allResidentUsers[0])
            this.alertMessage = "";
        else
            this.alertMessage = "No Resident Found";
            this.dataSource = new MatTableDataSource<any>(this.allResidentUsers);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.propertyDropdown=false;
       
    }
}
    btnCreate(){
      this.router.navigate(['/residents/create']);
    }

}
