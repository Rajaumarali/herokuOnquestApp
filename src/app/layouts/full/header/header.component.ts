import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { config } from '../../../config';
import { MatDialog } from '@angular/material/dialog';
import { LogoutpopupComponent } from '../../../common/component/logoutpopup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  userData:any;
  socket: any;
  public config: PerfectScrollbarConfigInterface = {};
  constructor(private router: Router, public dialog: MatDialog){
     this.userData = JSON.parse(localStorage.getItem('user'));
     if(!localStorage.getItem('user')){
        this.router.navigate(['/login']);
     }
     this.setupSocketConnection();
  }

  // This is for Notifications
  notifications: Object[] = [
    // {
    //   round: 'round-danger',
    //   icon: 'ti-link',
    //   title: 'Launch Admin',
    //   subject: 'Just see the my new admin!',
    //   time: '9:30 AM'
    // },
    // {
    //   round: 'round-success',
    //   icon: 'ti-calendar',
    //   title: 'Event today',
    //   subject: 'Just a reminder that you have event',
    //   time: '9:10 AM'
    // },
    // {
    //   round: 'round-info',
    //   icon: 'ti-settings',
    //   title: 'Settings',
    //   subject: 'You can customize this template as you want',
    //   time: '9:08 AM'
    // },
    // {
    //   round: 'round-primary',
    //   icon: 'ti-user',
    //   title: 'Pavan kumar',
    //   subject: 'Just see the my admin!',
    //   time: '9:00 AM'
    // }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];
  logout(){
    const dialogRef = this.dialog.open(LogoutpopupComponent, {
      width: '400px',
      data: {router: this.router}
  });

  dialogRef.afterClosed().subscribe(result => {
      
  });
  }
  userProfile(){
    this.router.navigate(['/profile']);
  }
  openMsgLog(user_id) {
    this.router.navigate(['/residents/' + user_id + '/messageLogs']);

  }
  setupSocketConnection() {
    this.socket = io(`${config.apiUrl}`);
    this.socket.on('my_broadcast', (data: any) => {
      var date = new Date();
      if(this.userData.phone==data.sender_phone_number)
      this.notifications.push({user_id: data.user_id, round: 'round-success',icon: 'ti-user',title: data.resident_name, subject: data.message,time: date.getHours()+":"+date.getMinutes()});
    });
  }
}
