import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('selectList', { static: false }) selectList: ElementRef;
  myControl = new FormControl();

  displayedColumns = ['service_name', 'resident', 'property_name', 'captain', 'status', 'created_at', 'user_profile_service_day'];
  allResidentUsers = [];
  allbuilding = [];
  allbuildingfilter = [];
  filterText;
  selectedProperty = '';
  dataSource;
  propertyDropdown = false;
  captains: any;
  alertMessage: any;
  userType: any;
  constructor(private router: Router, private service: TasksService, breakpointObserver: BreakpointObserver) {
    this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
    $('.page-title').text('All Tasks');

    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['service_name', 'resident', 'property_name', 'captain', 'status', 'responsible_party', 'created_at', 'user_profile_service_day'] :
        ['service_name', 'resident', 'property_name', 'captain', 'status', 'responsible_party', 'created_at', 'user_profile_service_day'];
    });
    this.getAllLocations();

  }
  ngOnInit() { }


  getAllResidents() {
    this.service.getAllResidents().subscribe((response: any) => {
      this.allResidentUsers = response;
      this.dataSource = new MatTableDataSource<any>(this.allResidentUsers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  getAllLocations() {
    this.service.getAllLocations().subscribe((response: any) => {
      if (this.userType == "3") {
        var building = JSON.parse(localStorage.getItem("user")).building_id;
        var findProp = response.filter(item => item.property_code == building)
        if (findProp) {
          this.allbuildingfilter = findProp;
          this.allbuilding = findProp;
        }
      } else if (this.userType == '6') {
        let region = JSON.parse(localStorage.getItem("user")).user_region;
        this.allbuilding = response.filter(item => item.region == region);
        this.allbuildingfilter = this.allbuilding;
      } else {
        this.allbuilding = response;
        this.allbuildingfilter = response;
      }
      var building = JSON.parse(localStorage.getItem("user")).building_id;
      if (this.userType == "3") {
        this.getCaptainsByPropertyCode(building,null,null);
      } else
        this.getAllCaptains('all');
    });
  }

  onChange(e) {
    this.alertMessage = "";
    this.propertyDropdown = true;
    if (e == "All") {
      this.selectedProperty = "";
      this.getAllCaptains('all');
      
    } else {
      this.selectedProperty = this.allbuildingfilter.find(item => item.property_name == e).property_code;
      // this.getAllCaptains(null);
    

    let data = { "property_code": this.selectedProperty, "captainId": "", "service_day": "" };
    this.service.getAllServices(data).subscribe((response: any) => {
      if(e!='All')
      this.getCaptainsByPropertyCode(this.selectedProperty,this.selectedProperty,response);
      

    }, err => {
      const bakingServices = [];
      this.dataSource = new MatTableDataSource<any>(bakingServices);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.alertMessage = err.error.message;
      this.propertyDropdown = false;
    });
  }
  }

  /**
   * Get location based upon captains code through request.
   * @param propertyCode property code .
   */
  getCaptainsByPropertyCode(propertyCode,selprop,response) {
    this.captains = "";
    var data = {
      "user_type": "captain",    // should be captain or resident
      "property_code": propertyCode
    }
    this.service.getAllCaptains(data).subscribe((res: any) => {
      this.captains = res;
      // if (this.userType == "3")
      if(response){
        const bakingServices = [];
        let index = 0;
        const servicesObject = response;
        for (let i = 0; i < servicesObject.length; i++) {
          const services = servicesObject[i];
          for (let j = 0; j < services.length; j++) {
            let captain = this.captains.find(itec => itec.user_id == services[j].assigned_captain_id)
            if (this.userType == '6' || this.userType == '3') {
              let findMatch = this.allbuildingfilter.find(item => item.property_code == services[j].building_code)
              if (findMatch) {
                bakingServices[index] = { ...services[j], responsible_party:services[j].responsible_party?services[j].responsible_party:'', status: services[j].service_enable != 'true' ? "Cancelled" : services[j].service_completed == 'true' ? 'Completed' : 'Not Completed', captain: captain ? captain.first_name + ' ' + captain.last_name : '', resident: services[j].first_name + " " + services[j].last_name, user_profile_service_day: services[j].user_profile_service_day == '1' ? 'Monday' : services[j].user_profile_service_day == '2' ? 'Tuesday' : services[j].user_profile_service_day == '3' ? 'Wednesday' : services[j].user_profile_service_day == '4' ? 'Thursday' : services[j].user_profile_service_day == '5' ? 'Friday' : services[j].user_profile_service_day == '6' ? 'Saturday' : services[j].user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' };
                index++;
              }
            } else {
              bakingServices[index] = { ...services[j], responsible_party:services[j].responsible_party?services[j].responsible_party:'', status: services[j].service_enable != 'true' ? "Cancelled" : services[j].service_completed == 'true' ? 'Completed' : 'Not Completed', captain: captain ? captain.first_name + ' ' + captain.last_name : '', resident: services[j].first_name + " " + services[j].last_name, user_profile_service_day: services[j].user_profile_service_day == '1' ? 'Monday' : services[j].user_profile_service_day == '2' ? 'Tuesday' : services[j].user_profile_service_day == '3' ? 'Wednesday' : services[j].user_profile_service_day == '4' ? 'Thursday' : services[j].user_profile_service_day == '5' ? 'Friday' : services[j].user_profile_service_day == '6' ? 'Saturday' : services[j].user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' };
              index++;
            }
          }
        }
        localStorage.setItem('tasklist', JSON.stringify(bakingServices));
        this.dataSource = new MatTableDataSource<any>(bakingServices);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.propertyDropdown = false;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.captain.toLowerCase().includes(filter) || data.property_name.toLowerCase().includes(filter) || data.service_name.toLowerCase().includes(filter)
            || data.user_profile_service_day.toLowerCase().includes(filter)|| data.responsible_party.toLowerCase().includes(filter) || data.resident.toLowerCase().includes(filter) || data.status.toLowerCase().includes(filter) || data.created_at.toString().includes(filter);
        };
      }
      // this.getAllTasksWithAllCaptains(selprop);

    });
  }
  getCaptainName(cpatainId) {
    let captain = this.captains.filter((user) => {
      return user.user_id == cpatainId;
    });
    if (captain.length != 0) {
      return captain[0].first_name;
    } else {
      return "Not assigned any captain yet!";
    }
  }

  btnClick(btntype) {
    this.router.navigate(['/tasks/' + btntype + '/edit']);
  }

  detail(index) {
    localStorage.setItem('task', JSON.stringify(index));
    this.router.navigate(['/tasks/' + 1 + '/view']);
  }

  filterItem(event) {
    if (!event) {
      this.allbuilding = this.allbuildingfilter;
    } // when nothing has typed*/   
    if (typeof event === 'string') {
      this.allbuilding = this.allbuildingfilter.filter(a => a.property_name.toLowerCase()
        .startsWith(event.toLowerCase()));
    }
    this.selectList.nativeElement.size = this.allbuilding.length + 1;
  }

  applyFilter(filterValue: string) {
    // filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  getAllTasksWithAllCaptains(selprop) {
    this.propertyDropdown = true;
    this.alertMessage = "";
    let data: any;
    if (this.userType == "3") {
      var building = JSON.parse(localStorage.getItem("user")).building_id;
      data = { "property_code": building, "captainId": "", "service_day": "" };

    } else if(selprop)
      data = { 'property_code': selprop, 'captainId': '', 'service_day': '' };
      else
      data = { 'property_code': '', 'captainId': '', 'service_day': '' };
    this.service.getAllServices(data).subscribe((response: any) => {

      const bakingServices = [];
      let index = 0;

      const servicesObject = response;
      for (let i = 0; i < servicesObject.length; i++) {
        const services = servicesObject[i];
        for (let j = 0; j < services.length; j++) {
          let captain = this.captains.find(itec => itec.user_id == services[j].assigned_captain_id)
          if (this.userType == '6' || this.userType == '3') {
            let findMatch = this.allbuildingfilter.find(item => item.property_code == services[j].building_code)
            if (findMatch) {
              bakingServices[index] = { ...services[j], responsible_party:services[j].responsible_party?services[j].responsible_party:'', status: services[j].service_enable != 'true' ? "Cancelled" : services[j].service_completed == 'true' ? 'Completed' : 'Not Completed', captain: captain ? captain.first_name + ' ' + captain.last_name : '', resident: services[j].first_name + " " + services[j].last_name, user_profile_service_day: services[j].user_profile_service_day == '1' ? 'Monday' : services[j].user_profile_service_day == '2' ? 'Tuesday' : services[j].user_profile_service_day == '3' ? 'Wednesday' : services[j].user_profile_service_day == '4' ? 'Thursday' : services[j].user_profile_service_day == '5' ? 'Friday' : services[j].user_profile_service_day == '6' ? 'Saturday' : services[j].user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' };
              index++;
            }
          } else {
              bakingServices[index] = { ...services[j], responsible_party:services[j].responsible_party?services[j].responsible_party:'', status: services[j].service_enable != 'true' ? "Cancelled" : services[j].service_completed == 'true' ? 'Completed' : 'Not Completed', captain: captain ? captain.first_name + ' ' + captain.last_name : '', resident: services[j].first_name + " " + services[j].last_name, user_profile_service_day: services[j].user_profile_service_day == '1' ? 'Monday' : services[j].user_profile_service_day == '2' ? 'Tuesday' : services[j].user_profile_service_day == '3' ? 'Wednesday' : services[j].user_profile_service_day == '4' ? 'Thursday' : services[j].user_profile_service_day == '5' ? 'Friday' : services[j].user_profile_service_day == '6' ? 'Saturday' : services[j].user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' };
            index++;
          }
        }
      }

      localStorage.setItem('tasklist', JSON.stringify(bakingServices));
      this.dataSource = new MatTableDataSource<any>(bakingServices);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.propertyDropdown = false;
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return data.captain.toLowerCase().includes(filter) || data.property_name.toLowerCase().includes(filter) || data.service_name.toLowerCase().includes(filter)
          || data.user_profile_service_day.toLowerCase().includes(filter)|| data.responsible_party.toLowerCase().includes(filter) || data.status.toLowerCase().includes(filter) || data.resident.toLowerCase().includes(filter) || data.created_at.toString().includes(filter);
      };

    }, err => {
      const bakingServices = [];
      this.dataSource = new MatTableDataSource<any>(bakingServices);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.alertMessage = err.error.message;
      this.propertyDropdown = false;
    });
  }
  /**
   * Get location based upon captains code through request.
   */
  getAllCaptains(prop) {
    this.captains = [];
    
    this.service.getAllPropertyCaptains().subscribe((response: any) => {
      var findAllProp;
      if (this.userType == '3' || this.userType == '6') {
        var region = JSON.parse(localStorage.getItem("user")).user_region;
        findAllProp = this.allbuildingfilter.filter(item => item.region == region);

      } else {
        findAllProp = this.allbuildingfilter
      }
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
      
      this.captains = findAllResi;
      // if(prop=='all')
      this.getAllTasksWithAllCaptains(null);

    });
  }

}
