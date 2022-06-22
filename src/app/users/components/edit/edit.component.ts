import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import {MatSnackBar} from "@angular/material/snack-bar";
import {JsonParseMode} from '@angular-devkit/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {
  options: FormGroup;

  @ViewChild('form') profileForm: NgForm;
  isError = false;
  showLoader = false;
  fileData: File = null;
  previewUrl: any = null;
  uploadedFilePath: string = null;
  user = {
    'first_name': '',
    'last_name': '',
    'email': '',
    'phone':'',
    'profile_picture_url': '',
    'birthday': '',
    'street_name': '',
    'unit_number': '',
    'user_region': '',
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
    'building_id': '',
    'property_code': '',
    'region':'', 
    'additional_building': '',
    'who_i_am': '',
    'what_i_do': '',
    'user_type_id': ''
  };
  user_id = null;
  alert = {};
  allBuilding: any;
  allRegion: any;
  userType:any;
  passMatchErr = '';
    pass = '';
    cpass = '';
    storedPassword='';
    showPassFields = false;
    passBtnName = 'Change Password';
  constructor(fb: FormBuilder , private route: ActivatedRoute , private authService: AuthService, private router: Router, public snackBar: MatSnackBar) {
    $('.page-title').text('Edit User');
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

  getPhone = function(phone){
    if(phone!=null){
        phone = phone.replace("+1","");
        phone = phone.replace("+92","");
        return phone.replace(/^(\d{3})(\d{3})/, "$1-$2-");
        }
        return "N/A";
};

  ngOnInit() {
    this.user_id = this.route.snapshot.params.id;
    this.authService.getUserProfile(this.user_id).subscribe((responseM) => {
      if(responseM.birthday!=null&&responseM.birthday!="")
      responseM.birthday = new Date(responseM.birthday);
      this.user = responseM;
      this.userType = JSON.parse(this.user.user_type_id);
      this.storedPassword = responseM.password;
      if(this.user.user_type_id=='4' || this.user.user_type_id=='5'){
        this.user = {...this.user,user_region: 'ALL',building_id: 'ALL'};
      }
      this.previewUrl = this.user.profile_picture_url;
    });
    this.authService.getAllLocations().subscribe((response: any) => {
      
      var useType = JSON.parse(localStorage.getItem("user")).user_type_id;
      if(useType=="3"){
        var building = JSON.parse(localStorage.getItem("user")).building_id;
        var findProp = response.filter(item=> item.property_code==building)
            if(findProp){
                this.allBuilding = findProp;
            }
      }else if(useType=='6'){
        let region = JSON.parse(localStorage.getItem("user")).user_region;
        this.allBuilding = response.filter(item=>item.region == region);
      }else{
      this.allBuilding = response;
      var tempRegion = [];
        this.allBuilding.map(item => {
            if(tempRegion[0]){
              let foundRegion = tempRegion.find(it => it.region==item.region);
              if(foundRegion){}
              else
              tempRegion.push(item);
            }else
            tempRegion.push(item);
        });
        this.allRegion = tempRegion;
      }
      
    });

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

openGallery(){
  $(".form-control.b-b").click();
}
toogleFields () {
  this.showPassFields = !this.showPassFields;
  if (this.showPassFields) {
      this.passBtnName = 'Dont Change Password';
  } else {
      this.passBtnName = 'Change Password';
  }
}

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  onSubmit () {
    this.showLoader = true;
    let bday = new Date(this.profileForm.value.birthday);
    this.profileForm.value.birthday = bday.getMonth()+1 + "/" + bday.getDate() + "/" + bday.getFullYear();
    if (this.fileData) {
      const formData = new FormData();
      formData.append('uploaded_file', this.fileData);
      // if(this.userType=='5'||this.userType=='4'){
        
      // }
      
      this.authService.uploadDP(formData)
      .subscribe((res) => {
        if (res) {
              this.uploadedFilePath = res.imageUrl;

              const data = {user_type_id: '2', user_id: this.user_id, ...this.profileForm.value,password: this.showPassFields ? this.pass : this.storedPassword, profile_picture_url: this.uploadedFilePath,user_region:this.user.user_region, additional_building: String(this.user.additional_building)};
              this.updateCaptain(data);
              
            }else{
              // this.showLoader = false;

            }
          });
        } else {
      const data = {user_type_id: '2', user_id: this.user_id, ...this.user,...this.profileForm.value,password: this.showPassFields ? this.pass : this.storedPassword, additional_building: String(this.user.additional_building),user_region:this.user.user_region};
      this.updateCaptain(data);
      this.showLoader=true;
    }
  }
  updateCaptain(data) {
    
    this.authService.updateUserProfile(data).subscribe((response: any) => {
      if (response) {
        this.openSnackBar( 'Updated Successfully', '');
        this.showLoader = false;

      } else {
        this.isError = true;
        this.showLoader = false;

      }
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
    this.router.navigate(['/users/']);
  }
}
