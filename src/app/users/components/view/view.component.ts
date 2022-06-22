import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-location-edit',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.css']
})

export class ViewComponent implements OnInit {

    @ViewChild('form') profileForm: NgForm;
    isError = false;
    showLoader = false;
    fileData: File = null;
    previewUrl: any = null;
    uploadedFilePath: string = null;
    user_id = null;
    alert = {};
    user:any = [];
    userObject:any;
    userType;
    constructor(public dialog: MatDialog,private service: AuthService, private route: ActivatedRoute ,private router: Router) {}
    ngOnInit() {
      $('.page-title').text('View Users');
      this.user_id = this.route.snapshot.params.id;
        this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
       this.service.getAllLocations().subscribe(resBuild => {
        this.service.getUserProfile(this.user_id).subscribe((response) => {
            this.user = response;
            if(response.user_type_id==3){
                let findRegion = resBuild.find(item => item.property_code==response.building_id).region;
                this.user={...this.user,user_region:findRegion};
                
            }
        });
    });

    }
    parseJson(jsonString) {
        return JSON.parse(jsonString);
    }
    getPhone = function(phone){
        if(phone!=null){
            phone = phone.replace("+1","");
            phone = phone.replace("+92","");
            return phone.replace(/^(\d{3})(\d{3})/, "$1-$2-");
            }
            return "N/A";
    };
    editResident(){
        this.router.navigate(['/users/' + this.user_id + '/edit']);
    }

   
}

