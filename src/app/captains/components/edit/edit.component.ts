import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CaptainsService} from '../../services/captains.service';
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
    'profile_picture_url': '',
    'birthday': '',
    'phone':'',
    'street_name': '',
    'unit_number': '',
    'city': '',
    'state': '',
    'zip_code': '',
    'any_pets': '',
    'user_type_id': '2',
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
    'additional_building': [''],
    'who_i_am': '',
    'what_i_do': '',
    "region":''
  };
  user_id = null;
  alert = {};
  userObject;
  passMatchErr = '';
    pass = '';
    cpass = '';
    storedPassword='';
    showPassFields = false;
    showPhoneChange = false;
    passBtnName = 'Change Password';
    phoneBtnName = 'Change Phone';
  newPhone='';
  allBuilding: any;
  allphones = [];
  allRegions= [];
  constructor(fb: FormBuilder , private route: ActivatedRoute , private captainsService: CaptainsService, private router: Router, public snackBar: MatSnackBar) {
    this.userObject = JSON.parse(localStorage.getItem('user'));
    this.captainsService.getPhoneNumbers().subscribe(res => {
      this.allphones=res;
      
  });
    $('.page-title').text('Edit Captain');
    
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
    this.captainsService.getAllLocations().subscribe((responseBuild: any) => {
      if(this.userObject.user_type_id=='3')
        this.allBuilding = responseBuild.filter(item=> item.property_code == this.userObject.building_id);
      else if(this.userObject.user_type_id=='6')
        this.allBuilding = responseBuild.filter(item=> item.region == this.userObject.user_region);
      else
      this.allBuilding=responseBuild;

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
        this.allRegions = tempRegion;
  
        
      this.captainsService.getUserProfile(this.user_id).subscribe((response) => {
        response.birthday = new Date(response.birthday);
        this.user = response;
        let findReg = responseBuild.find(item=>  item.property_code==this.user.building_id);
        if(findReg)
        this.user = {...this.user, region: findReg.region};
        
        if (this.user.additional_building != null) {
          this.user.additional_building = response.additional_building.split(',');
          if(!findReg){
          let findReg1 = responseBuild.find(item=>  this.user.additional_building.find(ite=> item.property_code==ite));
          
            if(findReg1)
              this.user = {...this.user, region: findReg1.region};
          }
          console.table(this.user.additional_building);
        }
        this.storedPassword = response.password;
        this.previewUrl = this.user.profile_picture_url;
      });
    });
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }
  openGallery(){
    $(".form-control.b-b").click();
  }
  onPhoneChange(phone){
    this.newPhone=phone;
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

  toogleFields () {
    this.showPassFields = !this.showPassFields;
    if (this.showPassFields) {
        this.passBtnName = 'Dont Change Password';
    } else {
        this.passBtnName = 'Change Password';
    }
}
tooglePhone () {
  this.showPhoneChange = !this.showPhoneChange;
  if (this.showPhoneChange) {
      this.phoneBtnName = 'Dont Change Phone';
  } else {
      this.phoneBtnName = 'Change Phone';
  }
}

  onSubmit () {
    this.showLoader = true;
    let bday = new Date(this.profileForm.value.birthday);
    this.profileForm.value.birthday = bday.getMonth()+1 + "/" + bday.getDate() + "/" + bday.getFullYear();

    if(this.showPhoneChange && this.newPhone!=''){
      var body = {phone_number: this.newPhone};
        
      this.captainsService.purchaseNumber(body).subscribe(res=> {
        if(res.status == "in-use"){
          if (this.fileData) {
            const formData = new FormData();
            delete this.profileForm.value.region;
            formData.append('uploaded_file', this.fileData);
            this.captainsService.Uploadimage(formData)
            .subscribe((res) => {
              if (res) {
                    this.uploadedFilePath = res.imageUrl;
      
                    const data = {...this.user,user_type_id: '2', user_id: this.user_id, ...this.profileForm.value,phone:this.newPhone, password: this.showPassFields ? this.pass : this.storedPassword, profile_picture_url: this.uploadedFilePath, additional_building: String(this.user.additional_building)};
                    this.updateCaptain(data);
                    
                  }else{
                    // this.showLoader = false;
      
                  }
                });
              } else {
            const data = {...this.user,user_type_id: '2', user_id: this.user_id, ...this.profileForm.value,phone:this.newPhone, password: this.showPassFields ? this.pass : this.storedPassword, additional_building: String(this.user.additional_building)};
            this.updateCaptain(data);
            this.showLoader=true;
          }
        }else{
          this.openSnackBar( 'Something went wrong. Please try again later.', '');
          this.showLoader = false;
        }
      });
    }else{
      if (this.fileData) {
        const formData = new FormData();
        delete this.profileForm.value.region;
        formData.append('uploaded_file', this.fileData);
        this.captainsService.Uploadimage(formData)
        .subscribe((res) => {
          if (res) {
                this.uploadedFilePath = res.imageUrl;
  
                const data = {...this.user,user_type_id: '2', user_id: this.user_id, ...this.profileForm.value, password: this.showPassFields ? this.pass : this.storedPassword, profile_picture_url: this.uploadedFilePath, additional_building: String(this.user.additional_building)};
                this.updateCaptain(data);
                
              }else{
                // this.showLoader = false;
  
              }
            });
          } else {
        const data = {...this.user,user_type_id: '2', user_id: this.user_id, ...this.profileForm.value, password: this.showPassFields ? this.pass : this.storedPassword, additional_building: String(this.user.additional_building)};
        this.updateCaptain(data);
        this.showLoader=true;
      }
    }

    
  }
  updateCaptain(data) {
    this.captainsService.updateUserProfile(data).subscribe((response: any) => {
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
    this.router.navigate(['/captains/' + this.user_id + '/view']);
  }
}
