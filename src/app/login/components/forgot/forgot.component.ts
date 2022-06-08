import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { CustomValidators  } from 'ngx-custom-validators';
import { NgForm } from '@angular/forms';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  public showvalid: any='none';
  public vcode: any;
  public userId: any;
  selectedUserType = '';

  allUsers = [{id:'3', name: "Concierge"},{id:'4', name: "Admin"}];
  
  constructor(private fb: FormBuilder, private router: Router, public service: AuthService) {}

  ngOnInit() {

  }

  cancel(){
    this.router.navigate(['/login']);
  }

  change(){

  }

  onSubmit() {
    console.log(this.form.value);
    if(this.form.value.validcode){
      if (this.form.value.validcode==this.vcode){
        this.router.navigate(['/login/update/' + this.userId]);
      }
    }else {
      var body = {email: this.form.value.email, user_type_id: this.selectedUserType};
      console.log(body);
      
      this.service.verifyEmailPass(body).subscribe((res: any) => {
        console.log(res); 
        if (res.verification_code) {
          this.showvalid = 'block';
          this.vcode=res.verification_code;
          this.userId = res.response[0].id;
        }
      });
    }
  }
}
