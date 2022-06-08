import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ServiceService} from '../../services/service.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-serviceedit',
  templateUrl: './serviceedit.component.html',
  styleUrls: ['./serviceedit.component.css']
})
export class ServiceeditComponent implements OnInit {
  @ViewChild('form') restrictionForm: NgForm;
  showLoader = false;
  isError = false;
  allService = [];
  allbuilding = [];
  service_restriction_type_id = '';
  id = '';
  restrictedService:any = {
    'service_name': '',
    'service_type': '',
    'service_image': '',
    'service_id': '',
    'service_restriction_type_id': '',
    'criteria': '',
    'city': '',
    'state' : '',
    'zip' : '',
    'building': ''
  };
  alert = {};
  constructor(private service: ServiceService, private route: ActivatedRoute, private router: Router,public snackBar: MatSnackBar) { }
  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.service.getRestrictedService(this.id).subscribe((response: any) => {
      this.restrictedService = response;
      this.restrictedService.service_id = this.restrictedService.service_id.toString();
      this.restrictedService.service_restriction_type_id = this.restrictedService.service_restriction_type_id.toString();
      if (this.restrictedService.service_restriction_type_id == '1') {
        this.restrictedService.city = this.restrictedService.criteria;
      } else if (this.restrictedService.service_restriction_type_id =='2') {
        this.restrictedService.state = this.restrictedService.criteria;
      } else if (this.restrictedService.service_restriction_type_id == '3') {
        this.restrictedService.building = this.restrictedService.criteria;
      } else {
        this.restrictedService.zip = this.restrictedService.criteria;
      }
    });
    this.service.getAlllocations().subscribe((response: any) => {
      this.allbuilding = response;
    });
    this.service.getAllServices().subscribe((response: any) => {
      this.allService = response;
    });
  }
  onSubmit () {
    this.showLoader = true;
    let data = {};
    let criteria = '';
    if (this.restrictionForm.value.service_restriction_type_id == '1') {
      criteria = this.restrictionForm.value.city;
    } else if (this.restrictionForm.value.service_restriction_type_id == '2') {
      criteria = this.restrictionForm.value.state;
    } else if (this.restrictionForm.value.service_restriction_type_id == '3') {
      criteria = this.restrictionForm.value.building;
    } else {
      criteria = this.restrictionForm.value.zip;
    }
    data = {
      'id': this.id,
      'service_id': this.restrictionForm.value.service_id,
      'service_restriction_type_id': this.restrictionForm.value.service_restriction_type_id,
      'criteria' : criteria
    };

    this.service.updateRestrictedS(data).subscribe((response) => {
      this.showLoader = false;
      this.openSnackBar( 'Updated Successfully', '');
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
    this.router.navigate(['/restrictedservices/']);
  }


}
