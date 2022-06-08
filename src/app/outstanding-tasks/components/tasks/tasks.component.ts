import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { TasksService } from '../../../tasks/services/tasks.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-listings',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  myControl = new FormControl();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = ['service_name', 'captain', 'property_name', 'first_name','status','created_at','user_profile_service_day'];
  allResidentUsers = [];
  allbuilding = [];
  allbuildingfilter = [];
  allTasks: any;
  allTasksfilter: any;
  selectedProperty = '';
  dataSource;
  showSelectProp = false
  propertyDropdown =  false;
  captains:any;
  alertMessage:any;
  userType;
constructor(private router: Router, breakpointObserver: BreakpointObserver, private service: TasksService) {
  let screenName = localStorage.getItem('screenName');
  if(screenName)
    $('.page-title').text(screenName);
  else
  $('.page-title').text("Outstanding Tasks");
  this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
  breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
    this.displayedColumns = result.matches ?
      [ 'service_name', 'captain', 'property_name', 'resident','status','created_at','user_profile_service_day'] :
      [ 'service_name', 'captain', 'property_name', 'resident','status','created_at','user_profile_service_day'];
  });
}
  ngOnInit() {
    this.getAllLocations();
    let allTasks = JSON.parse(localStorage.getItem('tasksListing'));
    let allCaptains = JSON.parse(localStorage.getItem('allCaptains'));
    
    allTasks.forEach(element => {
      let captains = allCaptains.find((user) => {
        return user.user_id == element.assigned_captain_id;
      });
      if(captains)
      element.captain = captains.first_name+' '+captains.last_name;
      
    });
    console.log(allCaptains);
    this.allTasks = allTasks;
    this.allTasksfilter = allTasks;
    localStorage.setItem('tasklist', JSON.stringify(this.allTasks));
    this.dataSource = new MatTableDataSource<any>(this.allTasks);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.resident.toLowerCase().includes(filter) || data.property_name.toLowerCase().includes(filter) || data.service_name.toLowerCase().includes(filter)
        || data.user_profile_service_day.toLowerCase().includes(filter)|| data.captain.toLowerCase().includes(filter)|| data.status.toLowerCase().includes(filter)|| data.created_at.toString().includes(filter);
    };
  }
  getAllLocations() {
    this.service.getAllLocations().subscribe((response: any) => {
      let allTasks = JSON.parse(localStorage.getItem('tasksListing'));
      let findOtherProp = response.filter(item => allTasks.find(ite=> ite.property_name == item.property_name));
      console.log(findOtherProp);
      let screenName = localStorage.getItem('screenName');
       if(screenName=="Outstanding Tasks")
        this.showSelectProp = true;
      else
        this.showSelectProp = false;
      if(this.userType=="3"){
        var building = JSON.parse(localStorage.getItem("user")).building_id;
        var findProp = response.filter(item=> item.property_code==building)
            if(findProp){
                this.allbuilding = findProp;
                this.allbuildingfilter = findProp;
            }
    }else if(this.userType=='6'){
      let region = JSON.parse(localStorage.getItem("user")).user_region;
      this.allbuilding = response.filter(item => item.region == region);
      this.allbuildingfilter = this.allbuilding;
    }else{
      this.allbuilding = response;
      this.allbuildingfilter = response;
    }
    });
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
      this.allTasks =this.allTasksfilter
      this.alertMessage = "";

      this.dataSource = new MatTableDataSource<any>(this.allTasks);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.propertyDropdown=false;
  }else{
      
      this.propertyDropdown=true;
      this.allTasks = this.allTasksfilter.filter(item => item.property_name==prop);
      if(this.allTasks[0])
          this.alertMessage = "";
      else
          this.alertMessage = "No Tasks Found";
          this.dataSource = new MatTableDataSource<any>(this.allTasks);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.propertyDropdown=false;
     
  }
}


  btnClick(btntype) {
      this.router.navigate(['/tasks/' + btntype + '/edit']);
  }

  detail(index) {
    localStorage.setItem('task', JSON.stringify(index));
    this.router.navigate(['/tasks/' + 1 + '/view']);
  }

  applyFilter(filterValue: string) {
    console.log(filterValue);
    
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
