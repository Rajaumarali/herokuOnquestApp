import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { CustomValidators  } from 'ngx-custom-validators';
import {AuthService} from '../../services/auth.service';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
@Component({
  selector: 'app-forgot',
  templateUrl: './updatePassword.html',
  styleUrls: ['./updatePassword.scss']
})
export class UpdatePassword implements OnInit {
  public form: FormGroup;
  public showLoader=false;
  public user_id:any;
  constructor(private fb: FormBuilder, private router: Router,private route: ActivatedRoute , public service: AuthService) {}

  ngOnInit() {
    this.user_id = this.route.snapshot.params.id;
    this.form = this.fb.group({
      password: password,
      confirmPassword: confirmPassword
    });
  }

  onSubmit() {
    console.log(this.form.value);
    this.showLoader=true;
    var data = {user_id: this.user_id,password: this.form.value.password,user_verified: 'true'};
    this.service.changePassword(data).subscribe((res: any) => {
      console.log(res);
      this.showLoader=false;
      this.router.navigate(['/login']);
    });
  }
}
