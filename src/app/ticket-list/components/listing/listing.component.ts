import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { TaskListStatusComponent } from '../../../common/component/taskListStatus';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = ['service_name', 'resident', 'property_name', 'first_name', 'service_completed', 'created_at', 'user_profile_service_day'];
  allResidentUsers = [];
  allbuilding; any;
  selectedProperty = '';
  dataSource;
  propertyDropdown = false;
  captains: any;
  alertMessage: any;
  propertyCode: any;
  totaltickets: any;
  openTickets: any;
  closedTickets: any;
  serviceDay = "";
  outStandingServices: any;
  completeService: any;
  constructor(public dialog: MatDialog, private router: Router, private service: TicketService, breakpointObserver: BreakpointObserver) {

    var url = window.location.href;
    this.propertyCode = url.split("/").pop();
    if (localStorage.getItem('serviceDay')) {

      this.serviceDay = localStorage.getItem('serviceDay');
    } else {
      this.serviceDay = ""
    }
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['service_name', 'resident', 'property_name', 'captain', 'status', 'responsible_party', 'created_at', 'user_profile_service_day'] :
        ['service_name', 'resident', 'property_name', 'captain', 'status', 'responsible_party', 'created_at', 'user_profile_service_day'];
    });
    //this.getAllResidents();
    this.getAllLocations()
    this.getCaptainsByPropertyCode(this.propertyCode);
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
      this.allbuilding = response.find(item => item.property_code == this.propertyCode);
      $('.page-title').text(this.allbuilding.property_name);

    });
  }

  getAllTasks() {
    this.totaltickets = 0;
    this.openTickets = 0;
    this.closedTickets = 0;
    this.propertyDropdown = true;
    this.alertMessage = "";
    let data = { "property_code": this.propertyCode, "captainId": "", "service_day": "" };
    this.service.getAllServices(data).subscribe((response: any) => {
      var bakingServices = [];
      let index = 0;
      const servicesObject = response;
      if (this.serviceDay != "") {
        for (let i = 0; i < servicesObject.length; i++) {
          const services = servicesObject[i];
          for (let j = 0; j < services.length; j++) {
          let captain = this.captains.find(itec => itec.user_id == services[j].assigned_captain_id)
          if (services[j].user_profile_service_day == this.serviceDay) {
              bakingServices[index] = { ...services[j], responsible_party:services[j].responsible_party?services[j].responsible_party:'', status: services[j].service_enable != 'true' ? "Cancelled" : services[j].service_completed == 'true' ? 'Completed' : 'Not Completed', captain: captain ? captain.first_name + ' ' + captain.last_name : '', resident: services[j].first_name + " " + services[j].last_name, user_profile_service_day: services[j].user_profile_service_day == '1' ? 'Monday' : services[j].user_profile_service_day == '2' ? 'Tuesday' : services[j].user_profile_service_day == '3' ? 'Wednesday' : services[j].user_profile_service_day == '4' ? 'Thursday' : services[j].user_profile_service_day == '5' ? 'Friday' : services[j].user_profile_service_day == '6' ? 'Saturday' : services[j].user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' };
              index++;
            }
          }
        }
      } else {
        for (let i = 0; i < servicesObject.length; i++) {
          const services = servicesObject[i];
          for (let j = 0; j < services.length; j++) {
          let captain = this.captains.find(itec => itec.user_id == services[j].assigned_captain_id)
          bakingServices[index] = { ...services[j], responsible_party:services[j].responsible_party?services[j].responsible_party:'', status: services[j].service_enable != 'true' ? "Cancelled" : services[j].service_completed == 'true' ? 'Completed' : 'Not Completed', captain: captain ? captain.first_name + ' ' + captain.last_name : '', resident: services[j].first_name + " " + services[j].last_name, user_profile_service_day: services[j].user_profile_service_day == '1' ? 'Monday' : services[j].user_profile_service_day == '2' ? 'Tuesday' : services[j].user_profile_service_day == '3' ? 'Wednesday' : services[j].user_profile_service_day == '4' ? 'Thursday' : services[j].user_profile_service_day == '5' ? 'Friday' : services[j].user_profile_service_day == '6' ? 'Saturday' : services[j].user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' };
            index++;
          }
        }
      }

      this.totaltickets = bakingServices.length;
      this.outStandingServices = bakingServices.filter((service) => {
        return service.service_completed == "false" && service.service_enable=='true';
      });
      this.openTickets = this.outStandingServices.length;
      this.completeService = bakingServices.filter((service) => {
        return service.service_completed == "true";
      });
      this.closedTickets = this.completeService.length;
      console.log(bakingServices);
      this.dataSource = new MatTableDataSource<any>(bakingServices);
      localStorage.setItem('tasklist', JSON.stringify(bakingServices));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.propertyDropdown = false;
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return data.captain.toLowerCase().includes(filter) || data.status.toLowerCase().includes(filter) || data.property_name.toLowerCase().includes(filter) || data.service_name.toLowerCase().includes(filter)
          || data.user_profile_service_day.toLowerCase().includes(filter) || data.resident.toLowerCase().includes(filter)|| data.responsible_party.toLowerCase().includes(filter)|| data.created_at.toString().includes(filter);
      };

    }, err => {
      const bakingServices = [];
      this.dataSource = new MatTableDataSource<any>(bakingServices);
      localStorage.setItem('tasklist', JSON.stringify(bakingServices));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.alertMessage = err.error.message;
      this.propertyDropdown = false;
    });
  }

  /**
   * Get location based upon captains code through request.
   * @param propertyCode property code .
   */
  getCaptainsByPropertyCode(propertyCode) {
    this.captains = "";
    var data = {
      "user_type": "captain",    // should be captain or resident
      "property_code": propertyCode
    }
    this.service.getAllCaptains(data).subscribe((response: any) => {
      this.captains = response;
      this.getAllTasks();
    });
  }

  openTask(list) {
    const dialogRef = this.dialog.open(TaskListStatusComponent, {
      width: '80vw',
      data: { service: this.service, list: list, captains: this.captains }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


  btnClick(btntype) {
    this.router.navigate(['/tasks/' + btntype + '/edit']);
  }

  detail(row) {
    localStorage.setItem('task', JSON.stringify(row));
    this.router.navigate(['/tasks/' + 2 + '/view']);
  }

  applyFilter(filterValue: string) {
    // filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
