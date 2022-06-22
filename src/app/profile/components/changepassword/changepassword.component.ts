import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ProfileService} from '../../services/profile.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-edit',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})

export class ChangePassword implements OnInit {
  @ViewChild('form') profileForm: NgForm;
  public form: FormGroup;
  isError = false;
  showLoader = false;
  fileData: File = null;
  previewUrl: any = null;
  uploadedFilePath: string = null;
  currentErrorMsg: string = "";
  user = {
    'first_name': '',
    'last_name': '',
    'email':'',
    'profile_picture_url': '',
    'birthday': '',
    'street_name': '',
    'unit_number': '',
    'city': '',
    'state': '',
    'zip_code': '',
    'user_type_id':'',
    'user_id': ''
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
  user_id = null;
  constructor(private fb: FormBuilder ,private service: ProfileService,public snackBar: MatSnackBar,  private router: Router) {}
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.user_id  = user.user_id;
    $('.page-title').text('Change Password');
    this.service.getUserProfile(this.user_id).subscribe((response: any) => {
      if (response) {
        this.user = response;
        this.previewUrl = response.profile_picture_url;
      }
    });
    const password = new FormControl(null, Validators.required);
    const confirmPassword = new FormControl(null, CustomValidators.equalTo(password));
    this.form = this.fb.group({
        cpassword: [
            null,
            Validators.compose([Validators.required])
        ],
        password: password,
        confirmPassword: confirmPassword
    });


  }
  userProfileUpdate(data) {
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
    var data = {username: this.user.email,password:this.form.value.cpassword,user_type_id: this.user.user_type_id}
        this.service.checkPass(data).subscribe((res:any)=>{
          if (res) {
            var data = {user_id: this.user.user_id, password: this.form.value.password, user_verified:'true'};
            this.service.changePass(data).subscribe((res:any)=>{
              if(res){
                this.openSnackBar( 'Updated successfully', '');
                this.showLoader=false;
              }
            })
          }
        }, (err) => {
          this.currentErrorMsg="Current Passsword doesn't match.";  
          this.showLoader = false;
      });

  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
        duration: 5000
    });
    this.router.navigate(['/dashboard/']);
}
}
