import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { config } from '../../config';

@Injectable()
export class AuthService {
  private urls = {
    // 'login':  `${config.apiUrl}/user/authenticate`,
    'get_profile': `${config.apiUrl}/user/getuser`,
    'update_profile': `${config.apiUrl}/user/profile`,
    // 'email_send': `${config.apiUrl}/email/send`,
    'dp_upload': `${config.apiUrl}/upload/image`,
    // 'sms_send': `${config.apiUrl}/user/message`,
    // 'message_logs': `${config.apiUrl}/user/message/getlogs`,
    // 'get_list': `${config.apiUrl}/groceryuseritems/get`,
    'delete_user': `${config.apiUrl}/user/delete`,
    'get_all_users': `${config.apiUrl}/user/allusers`,
    'create_users': `${config.apiUrl}/user/signup`,
    'getUsers': `${config.apiUrl}/user/getconciergeadmin`,
    'get_all_locations': `${config.apiUrl}/location/getall`
  };
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Allow': 'GET, POST, OPTIONS, PUT, DELETE'
    })
  };
  constructor(private httpClient: HttpClient, private router: Router) {
  }
  //   login(data) {
  //     return this.httpClient.post<any>(this.urls.login, data, this.httpOptions).pipe(
  //       map(res => res.response[0]),
  //       catchError(errorRes => {
  //         return throwError(errorRes);
  //       }));
  //   }
  //   getMessageLogs(user_id) {
  //     return this.httpClient.post<any>(this.urls.message_logs, { user_id: user_id}, this.httpOptions).pipe(
  //         map(res => res.response),
  //         catchError(errorRes => {
  //           return throwError(errorRes);
  //         }));
  //   }
  delete(id) {
    return this.httpClient.post<any>(this.urls.delete_user, { user_id: id }, this.httpOptions);
  }
  createUser(data) {
    return this.httpClient.post<any>(this.urls.create_users, data, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  updateUserProfile(data) {
    return this.httpClient.post<any>(this.urls.update_profile, data, this.httpOptions).pipe(
      map(res => res.response[0]),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getAllLocations() {
    return this.httpClient.get<any>(this.urls.get_all_locations, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getUsers() {
    console.log("this.urls.getUsers",this.urls.getUsers);
    return this.httpClient.get<any>(this.urls.getUsers, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getAllUsers(body) {
    return this.httpClient.post<any>(this.urls.get_all_users, body, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getUserProfile(user_id) {
    return this.httpClient.post<any>(this.urls.get_profile, { user_id: user_id }, this.httpOptions).pipe(
      map(res => res.response[0]),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  uploadDP(formData) {
    return this.httpClient.post<any>(this.urls.dp_upload, formData).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
}
