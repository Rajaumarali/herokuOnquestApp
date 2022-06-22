import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';
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
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css']
})

export class CreateComponent implements OnInit {
    @ViewChild('form') userForm: NgForm;
    public form: FormGroup;
    showLoader = false;
    isError = false;
    alert = {};
    user = {
        'first_name': '',
        'region':'',
        'last_name': '',
        'email': '',
        'password': '',
        'phone': '',
        'user_type_id': '',
        'building_id': ''
    };
    allbuilding = [];
    allRegion = [];
    allUsers = [{id:'3', name: "Basic User"}];
    allphones = [];
    selectedBuilding = '';
    selectedRegion='';
    selectedUserType = '';
    userType;
    constructor(private fb: FormBuilder , private authService: AuthService,  private router: Router,public snackBar: MatSnackBar) { }
    ngOnInit() {
        $('.page-title').text('Create Users');
        this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
        if(this.userType== '5')
            this.allUsers = [{id:'3', name: "Basic User"},{id:'4', name: "Global Admin"},{id:'6', name: "Regional Admin"},{id:'5', name: "Super Admin"}];
        else if(this.userType=='4')
            this.allUsers = [{id:'3', name: "Basic User"},{id:'4', name: "Global Admin"},{id:'6', name: "Regional Admin"}];
        else if(this.userType=='6')
            this.allUsers = [{id:'3', name: "Basic User"}];
        this.authService.getAllLocations().subscribe((response: any) => {
            if(this.userType=='6'){
                let region = JSON.parse(localStorage.getItem("user")).user_region;
                this.allbuilding = response.filter(item=> item.region==region);
            }else
            this.allbuilding = response;
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
        this.allRegion = tempRegion;
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
            phone: [
                null,
                Validators.compose([Validators.required])
            ],
            birthday: [
                null,
                Validators.compose([Validators.required])
            ],
            region: [
                null,
                Validators.compose([Validators.required])
            ],
            building_id: [
                null,
                Validators.compose([Validators.required])
            ],
            user_type_id: [
              null,
              Validators.compose([Validators.required])
            ],
            password: password,
            confirmPassword: confirmPassword
        });
    }
    onSubmit () {
        this.showLoader=true;
        let formData = this.form.value;
        
        let bday = new Date(formData.birthday);
        formData.birthday = bday.getMonth()+1 + "/" + bday.getDate() + "/" + bday.getFullYear();
        if(this.selectedUserType=='5'||this.selectedUserType=='4'){
            formData.building_id="";
            formData.region="";
        }
        if(this.selectedUserType=='6'){
            formData ={...formData,user_region:formData.region};
            delete formData.region;
        }
        delete formData.confirmPassword;
                this.authService.createUser(formData).subscribe((response) => {
                    if (!response.response){
                        this.openSnackBar( response.message, '');
                        this.showLoader=false;
                    } else {
                        this.openSnackBar('Successfully created user.', '');
                        this.showLoader = false;
                        this.router.navigate(['/users/']);
                    }
                });
            
            
       

    }
    change(){
    if(this.selectedUserType=='6'){
        this.form.get("building_id").clearValidators();
        this.form.get("building_id").updateValueAndValidity();  
        this.form.get("region").setValidators([Validators.required]);
        this.form.get("region").updateValueAndValidity(); 
    }else if(this.selectedUserType=='3'){
        this.form.get("region").clearValidators();
        this.form.get("region").updateValueAndValidity(); 
        this.form.get("building_id").setValidators([Validators.required]);
        this.form.get("building_id").updateValueAndValidity();     
      }else if(this.selectedUserType=='5'||this.selectedUserType=='4'){
        this.form.get("building_id").clearValidators();
        this.form.get("building_id").updateValueAndValidity(); 
        this.form.get("region").clearValidators();
        this.form.get("region").updateValueAndValidity();    
        this.selectedBuilding="ALL";
        this.selectedRegion="ALL";
      }
    }
    btnClick() {
        // this.router.navigate(['/users']);
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 10000
        });

    }
  

}
