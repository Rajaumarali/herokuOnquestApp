import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {ProfileService} from '../../services/profile.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {
  @ViewChild('form') profileForm: NgForm;
  isError = false;
  showLoader = false;
  fileData: File = null;
  previewUrl: any = null;
  uploadedFilePath: string = null;
  user = {
    'first_name': '',
    'last_name': '',
    'created_at':'',
    'email':'',
    'profile_picture_url': '',
    'birthday': '',
    'street_name': '',
    'phone': '',
    'city': '',
    'state': '',
    'zip_code': '',
    'building_id':'',
    'property_name':'',
    'user_type_id':'',
    'region':'',
    'user_region':''
    // 'any_pets': '',
    /*'emergency_contact_first_name': '',
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
    'notes': ''*/
  };
  allBuilding: any;
  allRegion=[];
  user_id = null;
  constructor(private service: ProfileService) {}
  ngOnInit() {
    $('.page-title').text('My Profile');
    const user = JSON.parse(localStorage.getItem('user'));
    this.user_id  = user.user_id;
    this.service.getUserProfile(this.user_id).subscribe((response: any) => {
      if (response) {
        response.birthday = new Date(user.birthday);
        this.user = response;
        console.log(this.user);
        if(this.user.user_type_id=='4' || this.user.user_type_id=='5')
        this.user = {...this.user, building_id:'All',user_region:'All'}
        this.previewUrl = response.profile_picture_url;
      }
    });
    this.service.getAllLocations().subscribe((response: any) => {
      if(user.user_type_id=='3'){
        response = response.filter(item => item.property_code==user.building_id);
        this.user = {...this.user,user_region:response[0].region}
        }
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
  });

  }

  getPhone = function(phone){
    if(phone!=null){
        phone = phone.replace("+1","");
        phone = phone.replace("+92","");
        return phone.replace(/^(\d{3})(\d{3})/, "$1-$2-");
        }
        return "N/A";
};
  userProfileUpdate(data) {
    
    console.log(data);

    this.service.updateUserProfile(data).subscribe((response: any) => {
      if (response) {
        localStorage.setItem('user', JSON.stringify(response));
        location.reload();
      } else {
        this.isError = true;
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
      this.isError = true;
    });
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    console.log(<File>fileInput.target.files[0]);
    this.preview();
  }

  openGallery(){
    $(".form-control.b-b").click();
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
    console.log(this.profileForm.value);
    
    if (this.fileData) {
      const formData = new FormData();
      console.log('filedata', this.fileData);
      formData.append('uploaded_file', this.fileData);
      let bday = new Date(this.profileForm.value.birthday);
      this.profileForm.value.birthday = bday.getMonth()+1 + "/" + bday.getDate() + "/" + bday.getFullYear();
      this.service.uploadDP(formData)
          .subscribe((res) => {
            if (res) {
              this.uploadedFilePath = res.imageUrl;
              const data = {
                ...this.user,
                ...this.profileForm.value,
                user_id: this.user_id,
                profile_picture_url: this.uploadedFilePath,
              };
              this.userProfileUpdate(data);
            }
          });
    } else {
      let bday = new Date(this.profileForm.value.birthday);
      this.profileForm.value.birthday = bday.getMonth()+1 + "/" + bday.getDate() + "/" + bday.getFullYear();
      const user = JSON.parse(localStorage.getItem('user'));
      const data = {...this.user,user_id: this.user_id, profile_picture_url: user.profile_picture_url, ...this.profileForm.value};
      console.log(this.profileForm.value);
      this.userProfileUpdate(data);
    }
  }
}
