import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CaptainsService } from '../../services/captains.service';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from '@angular/material/dialog';
import { DeletepopupComponent } from '../../../common/component/deletepopup.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  myControl = new FormControl();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = ['id', 'first_name', 'property_name', 'service_day', 'email', 'phone', 'city', 'Action'];
  allResidentUsers = [];
  allResidentUsersfilter = [];
  allbuilding = [];
  allbuildingfilter = [];
  selectedProperty = '';
  dataSource;
  userType;
  alertMessage = '';
  propertyDropdown = false;

  constructor(public dialog: MatDialog, private router: Router, private captainsService: CaptainsService, breakpointObserver: BreakpointObserver) {
    this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
    $('.page-title').text('All Captains');
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      if (this.userType == '5' || this.userType == '4' || this.userType == '3' || this.userType == '6') {
        this.displayedColumns = result.matches ?
          ['first_name', 'property_name', 'email', 'phone', 'city', 'Action'] :
          ['first_name', 'property_name', 'email', 'phone', 'city', 'Action'];
      } else {
        this.displayedColumns = result.matches ?
          ['first_name', 'property_name', 'email', 'phone', 'city'] :
          ['first_name', 'property_name', 'email', 'phone', 'city'];
      }
    });
    this.captainsService.getAllLocations().subscribe((response: any) => {
      this.allbuilding = response;
      this.allbuildingfilter = response;
    });
    this.getAllResidents();
  }
  ngOnInit() {

  }
  getPhone = function(phone){
    if(phone!=null){
      phone = phone.replace("+1","");
      phone = phone.replace("+92","");
      return phone.replace(/^(\d{3})(\d{3})/, "$1-$2-");
      }
      return "N/A";
  };
  filterItem(event) {
    if (!event) {
      this.allbuilding = this.allbuildingfilter;
    } // when nothing has typed*/   
    if (typeof event === 'string') {
      this.allbuilding = this.allbuildingfilter.filter(a => a.property_name.toLowerCase()
        .startsWith(event.toLowerCase()));
    }
    //   this.selectList.nativeElement.size = this.allbuilding.length + 1;
  }
  getAllResidents() {
    this.captainsService.getAllCaptains().subscribe((response: any) => {
      if (this.userType == "3") {
        var building = JSON.parse(localStorage.getItem("user")).building_id;
        var propName = JSON.parse(localStorage.getItem("user")).property_name;
        var findMatch = response.filter(item => {
          var additionaBuild: any;
          var findAddBuild = undefined;
          if (item.additional_building !== null && item.additional_building !== "null") {
            additionaBuild = item.additional_building.split(",");
            findAddBuild = additionaBuild.find(ite => ite == building)
          }
          if (item.property_name == propName || findAddBuild)
            return item;
        })
        response = findMatch;
      } else if (this.userType == "6") {
        var region = JSON.parse(localStorage.getItem("user")).user_region;
        var findAllProp = this.allbuildingfilter.filter(item => item.region == region);

        var findAllResi = response.filter(item => {
          var additionaBuild: any;
          var findAddBuild = undefined;
          if (item.additional_building !== null && item.additional_building !== "null") {
            additionaBuild = item.additional_building.split(",");
            findAddBuild = additionaBuild.find(ite => {
              var findadd = findAllProp.find(it => it.property_code == ite);
              if (findadd)
                return ite;
            })
          }

          var findMatchResi = findAllProp.find(itemProp => itemProp.property_code == item.property_code);
          if (findMatchResi || findAddBuild)
            return item;
        })
        response = findAllResi;
      }
      this.allResidentUsers = response;
      this.allResidentUsersfilter = response;
      this.dataSource = new MatTableDataSource<any>(this.allResidentUsers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.first_name.toLowerCase().includes(filter) || data.last_name.toLowerCase().includes(filter) || data.property_name.toLowerCase().includes(filter)
        || data.email.toLowerCase().includes(filter)|| data.phone.toString().includes(filter) || data.city.toLowerCase().includes(filter);
    };
    });

  }
  onChange(prop) {
    
    this.alertMessage="";
    this.propertyDropdown = true;
    if (prop == "All") {
      this.dataSource = new MatTableDataSource<any>(this.allResidentUsersfilter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.propertyDropdown = false;
    } else {
      var findPropCode = this.allbuildingfilter.find(item => item.property_name == prop).property_code;

      
      var findMatch = this.allResidentUsersfilter.filter(item => {
        var additionaBuild: any;
        var findAddBuild = undefined;
        if (item.additional_building !== null && item.additional_building !== "null") {
          additionaBuild = item.additional_building.split(",");
          findAddBuild = additionaBuild.find(ite => ite == findPropCode)
        }
        if (item.property_code == findPropCode || findAddBuild)
          return item;
      });
      if(!findMatch[0])
      this.alertMessage="No Captain Found"
      this.allResidentUsers = findMatch;
      this.dataSource = new MatTableDataSource<any>(this.allResidentUsers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.propertyDropdown = false;
    }
  }
  btnClick(btntype) {
    this.router.navigate(['/captains/' + btntype + '/edit']);
  }
  detail(uerId) {
    this.router.navigate(['/captains/' + uerId + '/view']);
  }
  btnCreate() {
    this.router.navigate(['/captains/create']);
  }
  applyFilter(filterValue: string) {
    // filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  openDialog(id): void {
    const dialogRef = this.dialog.open(DeletepopupComponent, {
      width: '400px',
      data: { id: id, service: this.captainsService, showConfirmField: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllResidents();
    });
  }
}
