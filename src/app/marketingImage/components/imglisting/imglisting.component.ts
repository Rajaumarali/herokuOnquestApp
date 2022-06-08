import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MarketingImageService } from '../../services/marketingImage.service';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DeletepopupComponent } from "../../../common/component/deletepopup.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-servicelisting',
  templateUrl: './imglisting.component.html',
  styleUrls: ['./imglisting.component.css']
})
export class ImglistingComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = ['image_url', 'title', 'status', 'Action'];
  dataSource;
  allImages: any = [];
  allbuilding: any;
  userType: any;
  constructor(public dialog: MatDialog, private router: Router, private service: MarketingImageService, private breakpointObserver: BreakpointObserver) {
    this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
    $('.page-title').text('Marketing Images');
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      if (this.userType == '5' || this.userType == '4') {
        this.displayedColumns = result.matches ?
          ['image_url', 'title', 'status', 'Action'] :
          ['image_url', 'title', 'status', 'Action'];
      } else {
        this.displayedColumns = result.matches ?
          ['image_url', 'title', 'status'] :
          ['image_url', 'title', 'status'];
      }
    });
    this.getBuildings();
    this.getAllImages();

  }
  ngOnInit() { }

  getBuildings() {
    this.service.getAllProp().subscribe((response: any) => {
      if (this.userType == '3') {
        var property_code = JSON.parse(localStorage.getItem("user")).building_id;
        console.log(property_code);

        var findProp = response.filter(item => item.property_code == property_code)
        if (findProp)
          this.allbuilding = findProp;
      } else if (this.userType == '6') {
        var region = JSON.parse(localStorage.getItem("user")).user_region;
        var findProp = response.filter(item => item.region == region)
        if (findProp)
          this.allbuilding = findProp;
      } else
        this.allbuilding = response;
    });
  }

  getAllImages() {
    this.service.getAllImages().subscribe((response: any) => {
      if (this.userType == "3") {
        var buildingCode = JSON.parse(localStorage.getItem("user")).building_id;
        var findMatch = response.filter(item => {
          var buildings = item.property_code.split(",");
          var findProp = buildings.find(it => it == buildingCode);
          if (findProp)
            return item;
        });
        if (findMatch)
          response = findMatch;
      } else if (this.userType == '6') {
        var findMatch = response.filter(item => {
          var buildings = item.property_code.split(",");
          console.log(buildings);

          var findProp = buildings.find(it => this.allbuilding.find(itemB => itemB.property_code == it));
          if (findProp)
            return item;
        });
        if (findMatch)
          response = findMatch;
      }
      this.allImages = response;
      console.log("this.allImages",this.allImages);
      this.dataSource = new MatTableDataSource<any>(this.allImages);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }
  btnClick(btntype) {
    this.router.navigate(['/marketingImage/' + btntype + '/edit']);
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  btncreate() {
    this.router.navigate(['/marketingImage/create']);
  }

  openDialog(id): void {
    const dialogRef = this.dialog.open(DeletepopupComponent, {
      width: '400px',
      data: { id: id, service: this.service }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllImages();
    });
  }

}
