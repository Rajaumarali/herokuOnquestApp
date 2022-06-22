import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReportsService } from '../services/reports.service';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

export interface Element {
  report_name: string;
  property: string;
  region: string;
  device_type: string;
  date: string;
}
const ELEMENT_DATA: Element[] = [
  {
    report_name: 'App Downloads',
    property: 'appDownload',
    region: 'appDownload',
    device_type: 'appDownload',
    date: 'appDownload'
  },
  {
    report_name: 'New Sign Up Activity',
    property: 'newSign',
    region: 'newSign',
    device_type: 'null',
    date: 'newSign'
  }
  ,
  {
    report_name: 'Residents List',
    property: 'null',
    region: 'null',
    device_type: 'null',
    date: 'yes'
  },
  {
    report_name: 'Captains List',
    property: 'null',
    region: 'null',
    device_type: 'null',
    date: 'yes'
  },
  {
    report_name: 'Tasks',
    property: 'dropdown',
    region: 'null',
    device_type: 'null',
    date: 'yes'
  }
  ,
  {
    report_name: 'Highest service usage',
    property: 'dropdowndate2',
    region: 'null',
    device_type: 'null',
    date: 'yes'
  }
  ,
  {
    report_name: 'Services status in specific period',
    property: 'dropdowndate3',
    region: 'null',
    device_type: 'null',
    date: 'yes'
  },
  {
    report_name: 'Active users in specific period',
    property: 'dropdowndate4',
    region: 'null',
    device_type: 'null',
    date: 'yes'
  }
];
// const ELEMENT_DATA: Element[] = [
//   {
//     report_name: 'Residents List',
//     description: 'Detailed report of all location residents.',
//   },
//   {
//     report_name: 'Captains List',
//     description: 'Detailed report of all location captains.',
//   },
//     {
//         report_name: 'Tasks',
//         description: 'dropdown',
//     }
//     ,
//     {
//         report_name: 'New Sign Up Activity',
//         description: 'dropdowndate',
//     }
//     ,
//     {
//         report_name: 'Highest service usage',
//         description: 'dropdowndate2',
//     }
//     ,
//     {
//         report_name: 'Services status in specific period',
//         description: 'dropdowndate3',
//     },
//     {
//         report_name: 'Active users in specific period',
//         description: 'dropdowndate4',
//     }
// ];
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})

export class ReportsComponent {
  public startdate;
  public enddate;
  public startdate1;
  public enddate1;
  public startdate2;
  public enddate2;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  @ViewChild('mySel') skillSel: MatSelect;
  @ViewChild('mySelCap') skillSelCap: MatSelect;
  @ViewChild('mySelResi') skillSelResi: MatSelect;
  displayedColumns = ['report_name', 'property', 'region', 'device_type', 'date'];
  reports = [{ name: 'App Downloads', id: 'app_downloads' }, { name: 'New Signup Activity', id: 'new_signup' }, { name: 'Properties', id: 'properties' },
  { name: 'Residents', id: 'residents' }, { name: 'Feature Usage', id: 'feature_usage' }, { name: 'Task Completion ', id: 'task_completion' }, { name: 'Task Detail List ', id: 'task_detail' },
  { name: 'InComplete Tasks', id: 'incomplete_tasks' }, { name: 'Payment Histories', id: 'payment_histories' }, { name: 'Admin Users', id: 'admin_users' },
  { name: 'Captain List', id: 'captain_list' }, { name: 'Missing Payment Method', id: 'missing_payment_method' }, { name: 'Property Summary', id: 'property_summary' }];
  device_types = ['All', 'Android', 'IOS'];
  services_types = ['GROCERY SHOPPING', 'FLOWER DELIVERY', 'RX PICK-UP', 'ONQUEST CLEAN', 'LAUNDRY PICK-UP', 'LAUNDRY DROP-OFF', 'PACKAGE PICK-UP'];
  selectedService = '';
  allCaptainUsers = [];
  allCaptainfilter = [];
  allResidentsFilter = [];
  allResidents = [];
  selectedCaptain = [];
  selectedResidents = [];
  allbuilding = [];
  allRegions = [];
  allbuildingFilter = [];
  downloadOption = 'PDF';
  selectedDevice = null;
  selectedRegionApp = null;
  selectedRegion = null;
  selectedReport = null;
  selectedRegionNewSign = null;
  selectedProperty = [];
  selectedPropApp = null;
  selectedProperty2 = null;
  selectedProperty3 = null;
  selectedProperty4 = null;
  selectedProperty5 = null;
  dataSource;
  maxDate: any;
  minDate: any;
  userType: any;
  allselected = false;
  allselectedCap = false;
  allselectedResi = false;
  constructor(private router: Router, private service: ReportsService, public snackBar: MatSnackBar, breakpointObserver: BreakpointObserver) {
    this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['report_name', 'property', 'region', 'device_type', 'date', 'Action'] :
        ['report_name', 'property', 'region', 'device_type', 'date', 'Action'];
    });
    this.maxDate = new Date();
    $('.page-title').text('Reports');

    this.maxDate.setDate(this.maxDate.getDate());
    this.maxDate.setMinutes(59);
    this.maxDate.setHours(23);
    this.maxDate.setMilliseconds(59);
    
    this.startdate = new FormControl('');
    this.enddate = new FormControl('');
    this.startdate1 = new FormControl('');
    this.enddate1 = new FormControl('');
    this.startdate2 = new FormControl('');
    this.enddate2 = new FormControl('');
    this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllLocations();
    this.getAllResidents();
    this.getAllCaptains();
    setInterval(()=> {
      if($('.mat-select-panel').length>0){
        if($('.mat-select-panel mat-option:first-child').attr('ng-reflect-value')!='All')
        $('.mat-select-panel mat-option:first-child').attr('style','margin-top:48px');
      }
    },500);
  }
  /*  ngOnInit() {
  
    }*/

  getAllResidents() {
    this.service.getAllResidents().subscribe(response => {
      this.allResidentsFilter = response;
    })
  }

  btnClick(btntype) {
    this.router.navigate(['/services/' + btntype + '/edit']);
  }
  detail() {
    localStorage.setItem("downloadOption", this.downloadOption);
    if (this.selectedRegion) {
      if (this.selectedProperty[0])
          localStorage.setItem("selectedProperty", JSON.stringify(this.selectedProperty));
        else {
          this.allbuilding.map(item => {
            if (this.selectedRegion == 'All')
              this.selectedProperty.push(item.property_code)
            else if (item.region == this.selectedRegion)
              this.selectedProperty.push(item.property_code)
          });
          localStorage.setItem("selectedProperty", JSON.stringify(this.selectedProperty));
        }
      if (this.selectedReport == 'app_downloads' || this.selectedReport == 'admin_users' || this.selectedReport == "captain_list") {
        localStorage.setItem("startdate", this.startdate.value.toLocaleString());
        localStorage.setItem("enddate", this.enddate.value.toLocaleString());
        localStorage.setItem("region", this.selectedRegion.toString());
        this.router.navigate(['/reports/' + this.selectedReport + '/view']);

      }
      else if (this.selectedReport == 'new_signup' || this.selectedReport == 'residents' || this.selectedReport == 'feature_usage') {
       
          
          localStorage.setItem("startdate", this.startdate.value.toLocaleString());
          localStorage.setItem("enddate", this.enddate.value.toLocaleString());
          this.router.navigate(['/reports/' + this.selectedReport + '/view']);
       
      }
      else if (this.selectedReport == 'properties' || this.selectedReport == 'missing_payment_method' || this.selectedReport == 'incomplete_tasks' || this.selectedReport == 'task_completion' || this.selectedReport == 'incomplete_tasks') {
       
          localStorage.setItem("startdate", this.startdate.value.toLocaleString());
          localStorage.setItem("enddate", this.enddate.value.toLocaleString());
          if (this.selectedCaptain[0])
            localStorage.setItem("selectedCaptain", JSON.stringify(this.selectedCaptain));
          else
            localStorage.setItem("selectedCaptain", "null");
          this.router.navigate(['/reports/' + this.selectedReport + '/view']);
       
      }
      else if (this.selectedReport == 'payment_histories') {
        if (this.selectedResidents[0])
          localStorage.setItem("selectedResidents", JSON.stringify(this.selectedResidents));
        else {
          this.allResidents.map(item => {
              let match = this.selectedProperty.find(ite=>ite.property_code==item.property_code);
              if(match)
              this.selectedResidents.push(item.user_id);
          });
          localStorage.setItem("selectedResidents", JSON.stringify(this.selectedResidents));
        }
        localStorage.setItem("startdate", this.startdate.value.toLocaleString());
        localStorage.setItem("enddate", this.enddate.value.toLocaleString());
        localStorage.setItem("selectedCaptain", "null");
        this.router.navigate(['/reports/' + this.selectedReport + '/view']);
      }
      else if (this.selectedReport == 'property_summary') {
        this.router.navigate(['/reports/' + this.selectedReport + '/view']);
        localStorage.setItem("startdate", this.startdate.value.toLocaleString());
        localStorage.setItem("enddate", this.enddate.value.toLocaleString());
      }
      else if (this.selectedReport == 'task_detail') {
        if ( this.selectedService != "") {
          localStorage.setItem("selectedService", this.selectedService.toLocaleString());
          localStorage.setItem("startdate", this.startdate.value.toLocaleString());
          localStorage.setItem("enddate", this.enddate.value.toLocaleString());
          if (this.selectedCaptain[0])
            localStorage.setItem("selectedCaptain", JSON.stringify(this.selectedCaptain));
          else
            localStorage.setItem("selectedCaptain", "null");
          this.router.navigate(['/reports/' + this.selectedReport + '/view']);
        } else {
        
         if (this.selectedService == "")
            this.openSnackBar('Please select the service from drop down.', '');
        }
      }
    } else {
      this.openSnackBar('Please select the region from drop down.', '');
    }

  }
  onClosed(id) {
    if (id == 0) {

    }
  }
  toggleAllSelection() {
    this.allselected = !this.allselected;  // to control select-unselect

    if (this.allselected) {
      this.skillSel.options.forEach((item: MatOption) => item.select());
      const index = this.selectedProperty.indexOf('All');

      this.selectedProperty.splice(index, 1);

    } else {
      this.skillSel.options.forEach((item: MatOption) => { item.deselect() });
    }
    // this.skillSel.close();

  }
  toggleAllSelectionCap() {
    this.allselectedCap = !this.allselectedCap;  // to control select-unselect

    if (this.allselectedCap) {
      this.skillSelCap.options.forEach((item: MatOption) => item.select());
      const index = this.selectedCaptain.indexOf('All');

      this.selectedCaptain.splice(index, 1);

    } else {
      this.skillSelCap.options.forEach((item: MatOption) => { item.deselect() });
    }
    // this.skillSel.close();

  }
  toggleAllSelectionResi() {
    this.allselectedResi = !this.allselectedResi;  // to control select-unselect

    if (this.allselectedResi) {
      this.skillSelResi.options.forEach((item: MatOption) => item.select());
      const index = this.selectedResidents.indexOf('All');

      this.selectedResidents.splice(index, 1);

    } else {
      this.skillSelResi.options.forEach((item: MatOption) => { item.deselect() });
    }
    // this.skillSel.close();

  }
  onMultiBuildingChange(event) {
    this.skillSel.options.forEach((item: MatOption) => {
      if (item.value == 'All')
        item.deselect()
    });
    var time = setTimeout(() => {
      this.allCaptainUsers = this.allCaptainfilter.filter(item => {
        var additionaBuild: any;
        var findAddBuild = undefined;
        if (item.additional_building != null && item.additional_building != "null" && item.additional_building != "") {
          additionaBuild = item.additional_building.split(",");
          findAddBuild = additionaBuild.find(ite => this.selectedProperty.find(itemP => itemP == ite))
        }

        // var findMatchResi = this.allbuilding.find(itemProp => itemProp.property_code == item.property_code);
        if (this.selectedProperty.find(itemP => itemP == item.property_code) || findAddBuild)
          return item;
      });
      if (this.selectedReport == 'payment_histories')
        this.allResidents = this.allResidentsFilter.filter(item => this.selectedProperty.find(itemP => itemP == item.building_id));
      clearInterval(time);
    }, 500);

  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  onChange(selected) {
    if(selected=='cap'){
    this.skillSelCap.options.forEach((item: MatOption) => {
      if (item.value == 'All')
        item.deselect()
    });
    this.allselectedCap=false;
  }
  else{
  this.allselectedResi=false;
    this.skillSelResi.options.forEach((item: MatOption) => {
      if (item.value == 'All')
        item.deselect()
    });}
  }
  onRegionChange() {
    if (this.selectedRegion != 'All' && this.selectedRegion != '') {
      this.allbuilding = this.allbuildingFilter.filter(item => item.region == this.selectedRegion);

    }
    else
      this.allbuilding = this.allbuildingFilter;
    this.selectedProperty = [];
    this.selectedCaptain = [];
  }
  getAllLocations() {
    this.service.getAllLocations().subscribe((response: any) => {
      if (this.userType == '3') {
        var property_code = JSON.parse(localStorage.getItem("user")).building_id;

        var findProp = response.filter(item => item.property_code == property_code)
        if (findProp)
          // this.allbuilding = findProp;
          this.allbuildingFilter = findProp;
        var tempRegion = [];
        this.allbuildingFilter.map(item => {
          if (tempRegion[0]) {
            let foundRegion = tempRegion.find(it => it.region == item.region);
            if (foundRegion) { }
            else
              tempRegion.push(item);
          } else
            tempRegion.push(item);
        });
        this.allRegions = tempRegion;
      } else if (this.userType == '6') {
        var region = JSON.parse(localStorage.getItem("user")).user_region;
        var findProp = response.filter(item => item.region == region)
        if (findProp)
          // this.allbuilding = findProp;
          this.allbuildingFilter = findProp;
        var tempRegion = [];
        this.allbuildingFilter.map(item => {
          if (tempRegion[0]) {
            let foundRegion = tempRegion.find(it => it.region == item.region);
            if (foundRegion) { }
            else
              tempRegion.push(item);
          } else
            tempRegion.push(item);
        });
        this.allRegions = tempRegion;
      } else {
        // this.allbuilding = response;
        // this.allRegions = response
        this.allbuildingFilter = response;
        var tempRegion = [];
        this.allbuildingFilter.map(item => {
          if (tempRegion[0]) {
            let foundRegion = tempRegion.find(it => it.region == item.region);
            if (foundRegion) { }
            else
              tempRegion.push(item);
          } else
            tempRegion.push(item);
        });
        this.allRegions = tempRegion;
      }


    });
  }
  onBuildingChange() {
    if (this.selectedProperty[0]) {
      var findAllResi = this.allCaptainfilter.filter(item => {
        var additionaBuild: any;
        var findAddBuild = undefined;
        if (item.additional_building !== null && item.additional_building !== "null") {
          additionaBuild = item.additional_building.split(",");
          findAddBuild = additionaBuild.find(ite => ite == this.selectedProperty)
        }

        // var findMatchResi = this.allbuilding.find(itemProp => itemProp.property_code == item.property_code);
        if (this.selectedProperty == item.property_code || findAddBuild)
          return item;
      })
      this.allCaptainUsers = findAllResi;
    } else {
      var findAllResi = this.allCaptainfilter.filter(item => {
        var additionaBuild: any;
        var findAddBuild = undefined;
        if (item.additional_building !== null && item.additional_building !== "null") {
          additionaBuild = item.additional_building.split(",");
          findAddBuild = additionaBuild.find(ite => {
            var findadd = this.allbuilding.find(it => it.property_code == ite);
            if (findadd)
              return ite;
          })
        }

        var findMatchResi = this.allbuilding.find(itemProp => itemProp.property_code == item.property_code);
        if (findMatchResi || findAddBuild)
          return item;
      })
      this.allCaptainUsers = findAllResi;
    }
  }
  getAllCaptains() {
    this.service.getAllCaptains().subscribe(res => {
      if (this.userType == "3") {
        var building = JSON.parse(localStorage.getItem("user")).building_id;
        var propName = JSON.parse(localStorage.getItem("user")).property_name;
        var findMatch = res.filter(item => {
          var additionaBuild: any;
          var findAddBuild = undefined;
          if (item.additional_building !== null && item.additional_building !== "null") {
            additionaBuild = item.additional_building.split(",");
            findAddBuild = additionaBuild.find(ite => ite == building)
          }
          if (item.property_name == propName || findAddBuild)
            return item;
        })
        res = findMatch;
      } else if (this.userType == "6") {

        var findAllResi = res.filter(item => {
          var additionaBuild: any;
          var findAddBuild = undefined;
          if (item.additional_building !== null && item.additional_building !== "null") {
            additionaBuild = item.additional_building.split(",");
            findAddBuild = additionaBuild.find(ite => {
              var findadd = this.allbuilding.find(it => it.property_code == ite);
              if (findadd)
                return ite;
            })
          }

          var findMatchResi = this.allbuilding.find(itemProp => itemProp.property_code == item.property_code);
          if (findMatchResi || findAddBuild)
            return item;
        })
        res = findAllResi;
      }
      this.allCaptainfilter = res;

    })
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
