import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { MeetService } from '../../services/meet.service';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { CompleteTaskPopup } from '../../../common/component/completetaskpopup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class MeetGreetListingComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = [ 'first_name', 'captain', 'property_name', 'unit_number','meet_greet_time','user_profile_service_day','meet_greet_status','created_at','completion'];
  allMeetGreet = [];
  allbuilding = [];
  selectedProperty = '';
  dataSource;
  propertyDropdown =  false;
  captains:any;
  alertMessage:any;
  property_code:any;
  totalMeetGreet:any;
  openMeetGreet:any;
  closedMeetGreet:any;
  serviceDay="";
constructor(private router: Router , private service: MeetService ,breakpointObserver: BreakpointObserver, public dialog: MatDialog, ) {
  let screenName = localStorage.getItem('screenName');
  if(screenName)
    $('.page-title').text(screenName);
  else
  $('.page-title').text("Meet & Greets");
  var url = window.location.href;
    this.property_code = url.split("/").pop();
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
      [ 'resident', 'captain', 'property_name', 'unit_number','user_profile_service_day','meet_date','meet_time','status','created_at','completion'] :
      [ 'resident', 'captain', 'property_name', 'unit_number','user_profile_service_day','meet_date','meet_time','status','created_at','completion'] ;
    });
    // this.allMeetGreet = JSON.parse(localStorage.getItem("allMeetGreet"));
    
    this.getCaptainsByProperty()
    

}
  ngOnInit() {}


  getAllMeetGreet(){
    var body = {user_type: "resident", property_code: this.property_code};
    this.service.getUsersByProperty(body).subscribe(res=> {
         let  finalMeet = [];
         res.map(item => {
           let captain = this.captains.find(itec => itec.user_id == item.assigned_captain_id)
             if(item.meet_greet_date_time!=null&& item.meet_greet_date_time!=""){
              let dateTimeMeet = new Date(item.meet_greet_date_time);              
              finalMeet.push({...item,status:item.meet_greet_status == 'true'||item.meet_greet_status == 'completed'?"Completed":'Open', captain: captain ? captain.first_name + ' ' + captain.last_name : '',resident: item.first_name+' '+item.last_name,meet_date: dateTimeMeet.getDay()+'/'+dateTimeMeet.getMonth()+'/'+dateTimeMeet.getFullYear(),meet_time:dateTimeMeet.toLocaleTimeString(), user_profile_service_day: item.user_profile_service_day == '1' ? 'Monday' : item.user_profile_service_day == '2' ? 'Tuesday' : item.user_profile_service_day == '3' ? 'Wednesday' : item.user_profile_service_day == '4' ? 'Thursday' : item.user_profile_service_day == '5' ? 'Friday' : item.user_profile_service_day == '6' ? 'Saturday' : item.user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' }) 
            }else
            finalMeet.push({...item,status:item.meet_greet_status == 'true'||item.meet_greet_status == 'completed'?"Completed":'Open', captain: captain ? captain.first_name + ' ' + captain.last_name : '',resident: item.first_name+' '+item.last_name, meet_date: "N/A",meet_time:"N/A", user_profile_service_day: item.user_profile_service_day == '1' ? 'Monday' : item.user_profile_service_day == '2' ? 'Tuesday' : item.user_profile_service_day == '3' ? 'Wednesday' : item.user_profile_service_day == '4' ? 'Thursday' : item.user_profile_service_day == '5' ? 'Friday' : item.user_profile_service_day == '6' ? 'Saturday' : item.user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' })
          })
          
          this.dataSource = new MatTableDataSource<any>(finalMeet);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = function (data, filter: string): boolean {
            return data.captain.toLowerCase().includes(filter) || data.property_name.toLowerCase().includes(filter) || data.meet_date.toLowerCase().includes(filter)
              || data.user_profile_service_day.toLowerCase().includes(filter)|| data.meet_time.toLowerCase().includes(filter) || data.status.toLowerCase().includes(filter) || data.resident.toLowerCase().includes(filter)|| data.unit_number.toString().includes(filter) || data.created_at.toString().includes(filter);
          };
          this.totalMeetGreet = res.length;
          var finCompl = res.filter(item => item.meet_greet_status=='completed');
          this.closedMeetGreet = finCompl.length;
          this.openMeetGreet = res.length - finCompl.length;
        })
  }

  editResident(userID) {
    this.router.navigate(['/residents/' + userID + '/edit']);
}


  changeStatus(row,i){
    // this.allMeetGreet[i].meet_greet_status = true;
    
    if(row.meet_greet_status!='completed'){
      const dialogRef = this.dialog.open(CompleteTaskPopup, {
        width: '400px',
        data: {showConfirmField:true, message:"complete this Meet & Greet"}
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result=="COMPLETE"){
          var body = row;
          body.meet_greet_status = "completed";
          body.building_id = body.property_code;
          this.service.completeMeetGreet(body).subscribe(res=> {
          })
        }
      })
    }
  }

  getCaptainsByProperty(){
    var body = {"user_type":"captain","property_code": this.property_code};
    this.service.getUsersByProperty(body).subscribe(res=>{
      this.captains = res;
      this.getAllMeetGreet();
    })
  }

  btnClick(btntype) {
      this.router.navigate(['/tasks/' + btntype + '/edit']);
  }

  detail(uerId) {
    this.router.navigate(['/tasks/' + uerId + '/view']);
  }

  applyFilter(filterValue: string) {
    // filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
