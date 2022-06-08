import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { FormControl, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listings',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class TaskListStatusComponent implements OnInit {
  msg: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = [ 'service_name', 'resident', 'property_name', 'first_name','service_completed','created_at','user_profile_service_day'];
  dataSource;
  listType="";
  allUsers = [];
  services = [];
  captains=[];
  services_enable =[];
  allTasks=[];
  loader: any = true;
  constructor(
      public snackBar: MatSnackBar,
      breakpointObserver: BreakpointObserver
  ) {

      breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {

          this.displayedColumns = result.matches ?
          [ 'service_name', 'resident', 'property_name', 'first_name','service_completed','created_at','user_profile_service_day'] :
          [ 'service_name', 'resident', 'property_name', 'first_name','service_completed','created_at','user_profile_service_day'];

      });         
     this.allTasks = JSON.parse(localStorage.getItem('tasklist'));
                  
                  this.dataSource = new MatTableDataSource<any>(this.allTasks);
                  setTimeout(() => this.dataSource.paginator = this.paginator);
                  this.dataSource.sort = this.sort;
                  this.loader = false;
         
      
  }

  ngOnInit() {}
 
  openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
          duration: 5000
      });
  }
}
