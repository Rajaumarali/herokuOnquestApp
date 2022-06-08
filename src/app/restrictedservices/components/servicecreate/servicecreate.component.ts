import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ServiceService} from '../../services/service.service';
import {MatSnackBar ,MatSnackBarConfig} from "@angular/material/snack-bar";

@Component({
  selector: 'app-serviceedit',
  templateUrl: './servicecreate.component.html',
  styleUrls: ['./servicecreate.component.css']
})
export class ServicecreateComponent implements OnInit {
  @ViewChild('form') restrictionForm: NgForm;
  showLoader = false;
  isError = false;
  allService = [];
  allbuilding = [];
  service_restriction_type_id = '';
  alert = {};
  state="";
  constructor(private service: ServiceService, private route: ActivatedRoute, private router: Router,public snackBar: MatSnackBar) { }
  ngOnInit() {
    this.service.getAlllocations().subscribe((response: any) => {
      this.allbuilding = response;
    });
    this.service.getAllServices().subscribe((response: any) => {
      this.allService = response;
    });
  }
  onSubmit () {
    localStorage.setItem( 'serValue' , '');
    this.showLoader = true;
    let data = {};
    let criteria = '';
    if (this.restrictionForm.value.service_restriction_type_id == '1') {
      criteria = this.restrictionForm.value.city;
    } else if (this.restrictionForm.value.service_restriction_type_id == '2') {
      criteria = this.state;
    } else if (this.restrictionForm.value.service_restriction_type_id == '3') {
      criteria = this.restrictionForm.value.building;
    } else {
      criteria = this.restrictionForm.value.zip;
    }
    data = {
      'service_id': this.restrictionForm.value.service_id,
      'service_restriction_type_id': this.restrictionForm.value.service_restriction_type_id,
      'criteria' : criteria
    };

    this.service.createRestrictedS(data).subscribe((response) => {
      this.showLoader = false;

     this.openSnackBar( 'Created successfully', '');
     });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
    this.router.navigate(['/restrictedservices/']);
  }
}
