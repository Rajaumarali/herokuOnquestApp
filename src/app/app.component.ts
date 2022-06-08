import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {
    const myData = JSON.parse(localStorage.getItem('user'));
    if(!localStorage.getItem('user')){
      this.router.navigate(['/login']);
    }
   }
}
