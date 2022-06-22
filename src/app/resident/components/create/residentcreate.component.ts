import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {ResidentService} from '../../services/resident.service';
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
    templateUrl: './residentcreate.component.html',
    styleUrls: ['./residentcreate.component.css']
})

export class ResidentcreateComponent implements OnInit {
    @ViewChild('form') userForm: NgForm;
    public form: FormGroup;
    showLoader = false;
    isError = false;
    alert = {};
    user = {
        'first_name': '',
        'last_name': '',
        'unit_number':'',
        'email': '',
        'password': '',
        'phone': '',
        'user_type_id': '1',
        'building_id': ''
    };
    allbuilding = [];
    selectedBuilding = '';
    buildingID ;
    userType;
    constructor(private fb: FormBuilder , private service: ResidentService, private router: Router,public snackBar: MatSnackBar) { }
    ngOnInit() {
        $('.page-title').text('Create Resident');
        this.buildingID = JSON.parse(localStorage.getItem("user")).building_id;
      this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
      this.service.getAllLocations().subscribe((response: any) => {
            if(this.userType=='3'){
                
                this.allbuilding = response.response[0].filter(item => item.property_code== this.buildingID);
            }else if(this.userType=='6'){
                let region = JSON.parse(localStorage.getItem("user")).user_region;
            this.allbuilding = response.response[0].filter(item => item.region == region);
            }else{
                this.allbuilding = response;
            }
        });
        this.form = this.fb.group({
            first_name: [
                null,
                Validators.compose([
                    Validators.required,
                    // Validators.minLength(5),
                    // Validators.maxLength(10)
                ])
            ],
            last_name: [
                null,
                Validators.compose([
                    Validators.required,
                    // Validators.minLength(5),
                    // Validators.maxLength(10)
                ])
            ],
            unit_number: [
                null,
                Validators.compose([
                    Validators.required,
                    // Validators.minLength(5),
                    // Validators.maxLength(10)
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
            building_id: [
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
        delete formData.confirmPassword;
        let phone = "+1"+formData.phone;
        this.service.createResidentUsers({...formData,phone:phone,platform:'dashboard' , building_id: this.selectedBuilding.toString(),user_type_id: '1'}).subscribe((response) => {
            if(response.response){
            if(response.response[0].user_id){
                
                this.service.getPropertyInfo(response.response[0].building_id).subscribe(res=>{
                    var body = { first_name: 'Hi '+res.property_name+',', last_name: "", subject: "New Resident Created", email: res.property_email, message: "A new resident has been added to your property:\nProperty: "+res.property_name+"\nResident Name: "+response.response[0].first_name+" "+response.response[0].last_name+"\nResident's Phone Number: "+response.response[0].phone+"\n\n#GetABetterLife with OnQuest"};
                    var body2 = { first_name: "Hi Admin,", last_name: "", subject: "New Resident Created", email: 'admin@onquestapp.com', message: "A new resident has been added to your property:\nProperty: "+res.property_name+"\nResident Name: "+response.response[0].first_name+" "+response.response[0].last_name+"\nResident's Phone Number: "+response.response[0].phone+"\n\n#GetABetterLife with OnQuest"};
                    // var body2 = { first_name: "Admin", last_name: "", subject: "New Resident Created", email: 'admin@onquestapp.com', message: "New resident has been created in your property \nResident Name: "+response.response[0].first_name+" "+response.response[0].last_name+"\nResident Phone: "+response.response[0].phone};
                    var body3 = {
                        first_name: "",
                        last_name: "",
                        subject: "OnQuest - Permission to Enter",
                        email: res.property_email,
                        message: `I, ${response.response[0].first_name+" "+response.response[0].last_name}, authorize OnQuest Personal Concierge, LLC to access my apartment ${formData.unit_number} during my residency at ${res.property_name}. Please allow them access to my unit.\n\n#GetABetterLife`
                    };
                    var body4 = {
                        first_name: "",
                        last_name: "",
                        subject: "OnQuest - Permission to Enter",
                        email: formData.email,
                        message: `I, ${response.response[0].first_name+" "+response.response[0].last_name}, authorize OnQuest Personal Concierge, LLC to access my apartment ${formData.unit_number} during my residency at ${res.property_name}. Please allow them access to my unit.\n\n#GetABetterLife`
                    };
                    var body5 = {
                        first_name: "",
                        last_name: "",
                        subject: "OnQuest - Permission to Enter",
                        email: 'admin@onquestapp.com',
                        message: `I, ${response.response[0].first_name+" "+response.response[0].last_name}, authorize OnQuest Personal Concierge, LLC to access my apartment ${formData.unit_number} during my residency at ${res.property_name}. Please allow them access to my unit.\n\n#GetABetterLife`
                    };
                    this.service.sendEmail(body).subscribe(result=>{

                        this.service.sendEmail(body2).subscribe(result=>{

                            this.service.sendEmail(body3).subscribe(result=>{
                                this.service.sendEmail(body4).subscribe(result=>{
                                    this.service.sendEmail(body5).subscribe(result=>{
                                        this.openSnackBar( 'Created successfully', '','');
                                        this.showLoader=false;
            
                                    })
        
                                })
                            })
                        })
                    });
                    this.service
                })
            }
        }else if(response.message){
            this.openSnackBar( response.message, '','stay');
            this.showLoader=false;
        }
        });
    }
    btnClick() {
        this.router.navigate(['/users']);
    }
    openSnackBar(message: string, action: string,stay:string) {
        this.snackBar.open(message, action, {
            duration: 5000
        });
        if(stay=='')
        this.router.navigate(['/residents/']);
    }

}
