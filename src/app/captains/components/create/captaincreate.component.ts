import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {CaptainsService} from '../../services/captains.service';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { CustomValidators  } from 'ngx-custom-validators';
import {MatSnackBar} from "@angular/material/snack-bar";

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
@Component({
    selector: 'app-users-create',
    templateUrl: './captaincreate.component.html',
    styleUrls: ['./captaincreate.component.css']
})

export class CaptaincreateComponent implements OnInit {
    @ViewChild('form') userForm: NgForm;
    public form: FormGroup;
    showLoader = false;
    isError = false;
    alert = {};
    passfirst='';
    cpassfirst='';
    user = {
        'first_name': '',
        'last_name': '',
        'email': '',
        'password': '',
        'phone': '',
        'user_type_id': '2',
        'building_id': ''
    };
    allbuilding = [];
    allRegions = [];
    allphones = [];
    selectedBuilding = '';
    userRegion = '';
    selectedAddition = ''
    userType;
    buildingID;
    constructor(private fb: FormBuilder , private captainsService: CaptainsService,  private router: Router,public snackBar: MatSnackBar) { }
    ngOnInit() {
    $('.page-title').text('Add Captain');
    this.buildingID = JSON.parse(localStorage.getItem("user")).building_id;
      this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
        this.captainsService.getPhoneNumbers().subscribe(res => {
            // console.log(res);
            this.allphones=res;
            console.log(this.allphones);
            
        });
        this.captainsService.getAllLocations().subscribe((response: any) => {
            if(this.userType=='3'){
                response.map(item =>{
                    if(this.buildingID==item.property_code)
                        this.allbuilding = item;
                });
            }else if(this.userType=='6'){
                    let region = JSON.parse(localStorage.getItem("user")).user_region;
                    this.allbuilding = response.filter(item => item.region == region);
            }else{
                this.allbuilding = response;
            }
            var tempRegion = [];
        this.allbuilding.map(item => {
            if(tempRegion[0]){
              let foundRegion = tempRegion.find(it => it.region==item.region);
              if(foundRegion){}
              else
              tempRegion.push(item);
            }else
            tempRegion.push(item);
        });
        this.allRegions = tempRegion;
        });
        this.form = this.fb.group({
            first_name: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(0),
                    Validators.maxLength(20)
                ])
            ],
            last_name: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(0),
                    Validators.maxLength(20)
                ])
            ],
            email: [
                null,
                Validators.compose([Validators.required, CustomValidators.email])
            ],
            region:[
                null
            ],
            phone: [
                null
            ],
            building_id: [
                null,
                Validators.compose([Validators.required])
            ],
            additional_building: [
                null,
            ],
            password: password,
            confirmPassword: confirmPassword
        });
    }
    onSubmit () {
        this.showLoader=true;
        let formData = this.form.value;
        delete formData.confirmPassword;
        delete formData.region;
        var addBuild = '';
        if(formData.additional_building[0])
        formData.additional_building.map((item,index)=> {
            if(index==formData.additional_building.length - 1)
            addBuild += item+'';
            else
            addBuild += item+',';
        });
        formData  = {...formData, additional_building: addBuild,phone:"3937363673"}
        console.log(formData);
        var body = {phone_number: formData.phone};
        
        // this.captainsService.purchaseNumber(body).subscribe(res=> {
        //     console.log(res);
        //     if(res.status == "in-use"){

                this.captainsService.createCaptainUsers({...formData , building_id: this.selectedBuilding.toString(),user_type_id: '2'}).subscribe((response) => {
                    console.log(response);
                    if (!response.response){
                        this.openSnackBar( response.message, '');
                        this.showLoader=false;
                    } else {
                        this.openSnackBar('Successfully purchased phone number and created captain.', '');
                        this.showLoader = false;
                        this.router.navigate(['/captains/']);
                    }
                });
        //     }
            
        // })

    }
    onPropertyChange(propCode){
        this.user.building_id=propCode;
        console.log(this.userRegion);
        
    }
    onRegionChange(region){
        
        
    }
    btnClick() {
        this.router.navigate(['/users']);
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 10000
        });

    }
  

}
