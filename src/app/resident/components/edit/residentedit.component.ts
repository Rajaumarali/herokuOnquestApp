import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ResidentService} from '../../services/resident.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import {any} from "codelyzer/util/function";
import {MatTableDataSource} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import {CustomValidators} from 'ngx-custom-validators';
import { formatDate } from '@angular/common';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
@Component({
    selector: 'app-location-edit',
    templateUrl: './residentedit.component.html',
    styleUrls: ['./residentedit.component.css']
})

export class ResidenteditComponent implements OnInit {
    options: FormGroup;
    public formGroup = new FormGroup({
        date: new FormControl(null, [Validators.required])
    });
    public meet_greet_date_time;
    @ViewChild('form') profileForm: NgForm;
    @ViewChild("placesRef") placesRef : GooglePlaceDirective;
    isError = false;
    showLoader = false;
    meetgreetday = 'block';
    fileData: File = null;
    previewUrl: any = null;
    captainAssigned: any = false;
    uploadedFilePath: string = null;
    dateControl: any = null;
    minDate: any;
    maxDate: any;
    dateTimeChange = false;
    userDate: Date;
    selectedDate: any;
    user = {
        'first_name': '',
        'last_name': '',
        'email': '',
        'profile_picture_url': '',
        'birthday': '',
        'street_name': '',
        'unit_number': '',
        'city': '',
        'state': '',
        'zip_code': '',
        'any_pets': '',
        'emergency_contact_first_name': '',
        'emergency_contact_last_name': '',
        'emergency_contact_phone_number': '',
        'emergency_contact_relationship': '',
        'mates': '',
        'favorite_holiday': '',
        'favorite_candy': '',
        'favorite_cookie': '',
        'favorite_beer_wine': '',
        'hobbies': '',
        'favorite_sport': '',
        'other_information': '',
        'notes': '',
        'user_profile_service_day':'',
        "meet_greet_status": "",
        "meet_greet_date_time": "",
        "assigned_captain_id": '',
        'building_id':'',
        'property_code':'',
        'mate_first_name':'',
        'mate_last_name':'',
        'mate_phone':'',
        'phone':''
    };
    user_id = null;
    alert = {};
    allcaptains:any =[];
    allNotes:any;
    loader = false;
    showPassFields = false;
    passBtnName = 'Change Password';
    noteUpdate = false;
    note:any;
    petProfiles : any = [];
    houseKeeping: any = [];
    rxPickup: any= [];
    groceryShoping: any= [];
    service_day:any ;
    allBuilding:any;
    residentNotes:any;
    userObject:any;
    decpass:any;
    passMatchErr = '';
    pass = '';
    cpass = '';
    storedPassword= '';
    constructor(fb: FormBuilder , private service: AuthService, private route: ActivatedRoute , private residentService: ResidentService,private router: Router,public snackBar: MatSnackBar) {
      $('.page-title').text('Edit Resident');
      this.userObject = JSON.parse(localStorage.getItem('user'));
        this.options = fb.group({
            hideRequired: false,
            floatLabel: 'auto'
        });
    }
    // For form validator
    email = new FormControl('', [Validators.required, Validators.email]);
    // Sufix and prefix
    hide = true;

    getErrorMessage() {
        return this.email.hasError('required')
            ? 'You must enter a value'
            : this.email.hasError('email')
                ? 'Not a valid email'
                : '';
    }
    ngOnInit() {
        this.user_id = this.route.snapshot.params.id;

        this.service.getUserProfile(this.user_id).subscribe((user) => {
            console.log(user);
            user.birthday = new Date(user.birthday);
            user = {...user, phone:user.phone.replace("+1","")}
            this.user = user;
            this.userDate = new Date(user.meet_greet_date_time);
            this.storedPassword = user.password;
            if(user.assigned_captain_id!==null && user.assigned_captain_id!==""){
                this.captainAssigned = true;
            }
            if(user.meet_greet_date_time!=='' && user.meet_greet_date_time!==null)
            this.meet_greet_date_time = new FormControl(new Date(user.meet_greet_date_time));
            else
                this.meet_greet_date_time = new FormControl('');
            const now = new Date();
            this.minDate = new Date();
            this.minDate.setDate(now.getDate());
            console.log(user);
            if(user.meet_greet_status=="completed"){
                this.meetgreetday='none';
            }
            this.getNotes(user.user_id);
            if (this.user.assigned_captain_id) {
                this.user.assigned_captain_id = this.user.assigned_captain_id.toString();
            }
            this.residentService.getAllUsers({
                'user_type': 'captain',
                'property_code': this.user.building_id
            }).subscribe((response: any) => {
                this.allcaptains = response.filter(item => item.user_type_id=='2');
                console.log(response);
            });
            this.residentService.getLocation(this.user.building_id).subscribe((response: any) => {
                this.service_day = response.service_day.split(',');
            });
        });
        this.residentService.getAllUserprofile(this.user_id).subscribe((response) => {
            if(response.length > 0) {
                this.petProfiles = response.pet_profile[0];
                this.houseKeeping = response.house_keeping[0];
                this.rxPickup = response.rx_pickup[0];
                this.groceryShoping = response.grocery_shoping[0];
            }
        });
        this.residentService.getAllLocations().subscribe((response: any) => {
            if(this.userObject.user_type_id=='3'){
               
                this.allBuilding = response.filter(item=> item.property_code==this.userObject.building_id);
            }else if(this.userObject.user_type_id=='6'){
                this.allBuilding = response.filter(item=> item.region==this.userObject.user_region);
            }else{
                this.allBuilding = response;
            }
        });

    }
    getNotes(user_id){
        this.residentService.getNotes(this.user_id).subscribe((user) => {
            this.allNotes = user;
        });
    }

    changeBuild(event){
        console.log("hua");
        console.log(this.user.building_id);
        this.user.assigned_captain_id=null;
        this.residentService.getAllUsers({
            'user_type': 'captain',
            'property_code': this.user.building_id
        }).subscribe((response: any) => {
            this.allcaptains = response;
            console.log(response);
        });
    }

    saveNotes(){
       this.loader = true;
       let residentNote = { 
           "user_id": this.user_id,
           "captain_id": this.userObject.user_id,
            "concierage_captain_image": this.userObject.profile_picture_url,
            "name": this.userObject.first_name +" "+this.userObject.last_name,
            "note": this.residentNotes,
            }
        this.residentService.saveNotes(residentNote).subscribe((user) => {
            this.allNotes = user;
            this.residentNotes = "";
            this.loader = false;
        });
    }
    editNote(notes){
        this.note = notes
        this.noteUpdate = true;
        this.residentNotes = notes.note;
    }
    updateNotes(){
        this.loader = true;
        this.note.note = this.residentNotes;
        this.residentService.updateNotes(this.note).subscribe((user) => {
            this.residentNotes = "";
            this.allNotes = user;
            this.loader = false;
            this.noteUpdate = false;
        });
    }
    deleteNote(note){
        this.loader = true;
        this.residentService.deleteNotes(note).subscribe((user) => {
            this.residentNotes = "";
            this.allNotes = user;
            this.loader = false;
        });
    }
    cancelNotes(){
        this.noteUpdate = false;
        this.residentNotes = "";
    }

    toogleFields () {
        this.showPassFields = !this.showPassFields;
        if (this.showPassFields) {
            this.passBtnName = 'Dont Change Password';
        } else {
            this.passBtnName = 'Change Password';
        }
    }

    txtChange(txt, id) {
        if (id==0){
            this.pass = txt;
            if(txt !== this.cpass)
                this.passMatchErr = 'Password and confirm password fields must match!';
            else
                this.passMatchErr = '';
        }else if (id==1){
            this.cpass = txt;
            if(txt !== this.pass)
                this.passMatchErr = 'Password and confirm password fields must match!';
            else
                this.passMatchErr = '';
        }
    }

    onSubmit () {
        
        this.showLoader = true;
        let bday = new Date(this.profileForm.value.birthday);
        this.profileForm.value.city = jQuery('#city_places').val();
        this.profileForm.value.state = jQuery('#state_places').val();
        this.profileForm.value.birthday = bday.getMonth()+1 + "/" + bday.getDate() + "/" + bday.getFullYear();
        var data;
        let phone = "+1"+this.profileForm.value.phone;

        if(this.meet_greet_date_time.value!==null && this.meet_greet_date_time.value!=="Invalid Date")
            data = {user_id: this.user_id, meet_greet_status:this.user.meet_greet_status,...this.profileForm.value, phone:phone, password: this.showPassFields ? this.pass : this.storedPassword, meet_greet_date_time: this.meet_greet_date_time.value.toLocaleString()};
        else
            data = {user_id: this.user_id, meet_greet_status:this.user.meet_greet_status, ...this.profileForm.value, phone:phone, password: this.showPassFields ? this.pass : this.storedPassword, meet_greet_date_time:  ""};
            data.meet_greet_input_change = this.dateTimeChange;
        data.profile_picture_url = this.user.profile_picture_url;
        this.service.updateUserProfile(data).subscribe((response: any) => {
            if (response) {
                this.openSnackBar( 'Updated Successfully', '');
            } else {
                this.isError = true;
            }
            this.showLoader = false;
        });
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 5000
        });
        this.router.navigate(['/residents/'+this.user_id+'/view']);
    }
    meetgreetdayChange(event: any) {
        const sDate = new Date(event._d);
        if (this.userDate.getTime() !== sDate.getTime()) {
          this.dateTimeChange = true;
        }
      }
}
