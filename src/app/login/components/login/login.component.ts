/**
 * Created by Hamza on 5/7/2020.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    @ViewChild('form') loginForm: NgForm;
    isError = false;
    showLoader = false;
    alertMessage: '';
    isUserSelected=false;
    userTypes=[{id:"5",name:"Super Admin"},{id:"4",name:"Global Admin"},{id:"6",name:"Regional Admin"},{id:"3",name:"Basic User"}]
    constructor(private service: AuthService, private router: Router) { }

    ngOnInit() {
    }
    onSubmit() {        
        this.showLoader = true;
        this.isError = false;
        this.service.login({...this.loginForm.value,user_type_id:5}).subscribe((response) => {
            if (response) {
                localStorage.setItem('user', JSON.stringify(response));
                this.router.navigate(['/']).then(()=>{
                    setTimeout(() => {
                        window.location.reload();
                     }, 10);
                });
                
            } else {
                this.isError = true;
            }
            this.showLoader = false;
        }, (err) => {
            this.showLoader = false;
            this.isError = true;
        });
    }
    onChange(){
        this.isUserSelected=true;
    }
    openForgetScreen(){
        this.router.navigate(['/login/forgot']);
    }
}
