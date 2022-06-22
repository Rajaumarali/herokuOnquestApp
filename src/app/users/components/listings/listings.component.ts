import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { MatDialog } from '@angular/material/dialog';
import { DeletepopupComponent } from '../../../common/component/deletepopup.component';

@Component({
  selector: 'app-listing',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns = ['id', 'first_name','service_day','email','phone','type', 'Action'];
    allUsers = [];
    allbuilding = [];
    selectedProperty = '';
    dataSource;
    showLoader=false;
    types;
    userType;
    userID;
  constructor(public dialog: MatDialog,private router: Router , private authsService: AuthService ,breakpointObserver: BreakpointObserver) {
      this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
      this.userID = JSON.parse(localStorage.getItem("user")).user_id;
      $('.page-title').text('All Users');
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
        if (this.userType == '5' || this.userType == '6' || this.userType == '4' ) {
            this.displayedColumns = result.matches ?
                ['first_name','type', 'email', 'phone', 'Action'] :
                ['first_name','type', 'email', 'phone', 'Action'];
        }else {
            this.displayedColumns = result.matches ?
            ['first_name', 'email', 'phone','type'] :
            ['first_name', 'email', 'phone','type'];
        }
    });
    this.getAllUsers();
  }
    ngOnInit() {
     this.authsService.getAllLocations().subscribe((response: any) => {
            if (this.userType == '3' ) {
              var property_code = JSON.parse(localStorage.getItem("user")).building_id;
              
              var findProp = response.filter(item=> item.property_code==property_code)
              if(findProp)
              this.allbuilding = findProp;
          }else if(this.userType=='6'){
            let region = JSON.parse(localStorage.getItem("user")).user_region;
            this.allbuilding = response.filter(item=>item.region == region);
          }else
         this.allbuilding = response;
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
    getAllUsers() {
      this.showLoader=true
      this.authsService.getUsers().subscribe((response: any) => {
        
        var myInterval = setInterval(() => {
          
          if(this.allUsers[0]){
          
          this.dataSource = new MatTableDataSource<any>(this.allUsers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.showLoader=false;
          clearInterval(myInterval);
        }else{
          
        if(this.userType == '3' || this.userType=='6'){
         
          this.allbuilding.map(item => {
            var findMatch = response.filter(it => it.user_type_id=='3' && it.property_code==item.property_code);
            if(findMatch)
            this.allUsers= this.allUsers.concat(findMatch);
          });
          this.allUsers.map((item,index)=> {
            if(item.user_type_id=='3')
              this.allUsers[index]={...item,type:"Basic User"}
            else if(item.user_type_id=='4')
              this.allUsers[index]={...item,type:"Global Admin"}
            else if(item.user_type_id=='5')
              this.allUsers[index]={...item,type:"Super Admin"}
            else if(item.user_type_id=='6')
              this.allUsers[index]={...item,type:"Regional Admin"}
          });
        }else{
          this.allUsers = response.filter(item=>  item.user_id!==this.userID);
          this.allUsers.map((item,index)=> {
            if(item.user_type_id=='3')
              this.allUsers[index]={...item,type:"Basic User"}
            else if(item.user_type_id=='4')
              this.allUsers[index]={...item,type:"Global Admin"}
            else if(item.user_type_id=='5')
              this.allUsers[index]={...item,type:"Super Admin"}
            else if(item.user_type_id=='6')
              this.allUsers[index]={...item,type:"Regional Admin"}
          });
        }
      }
        // response.map(item=>{
        //   if(this.userType == '3' || this.userType=='6'){
        //     if(item.user_type_id!='4'&&item.user_type_id!='5' &&item.user_type_id!='6' && item.user_id!==this.userID)
        //       this.allUsers = response;
        //   }else if(this.userType=='4' || this.userType=='5'){
        //     if(item.user_id!==this.userID)
        //       this.allUsers = response;
        //   }
        // });
        },1000)
      });

  }
    onChange() {
        // this.captainsService.getAllUsers({
        //     'user_type': 'resident',
        //     'property_code': this.selectedProperty
        // }).subscribe((response: any) => {
        //     this.allUsers = response;
        //     this.dataSource = new MatTableDataSource<any>(this.allUsers);
        //     this.dataSource.paginator = this.paginator;
        //     this.dataSource.sort = this.sort;
        // });

    }
    btnClick(btntype) {
            this.router.navigate(['/users/' + btntype + '/edit']);
    }
    detail(uerId) {
        this.router.navigate(['/users/' + uerId + '/view']);
    }
    btnCreate(){
        this.router.navigate(['/users/create']);
    }
    applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
    }
    openDialog(id): void {
      const dialogRef = this.dialog.open(DeletepopupComponent, {
          width: '400px',
          data: {id:  id, service: this.authsService}
      });

      dialogRef.afterClosed().subscribe(result => {
        
          this.getAllUsers();
      });
  }
}
