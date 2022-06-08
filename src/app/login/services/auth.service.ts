import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {Router} from '@angular/router';
import { config } from '../../config';

@Injectable()
export class AuthService {
  private urls =  {
    'login':  `${config.apiUrl}/user/authenticate`,
    'get_profile': `${config.apiUrl}/user/getuser`,
    'update_profile': `${config.apiUrl}/user/profile`,
    'dp_upload': `${config.apiUrl}/upload/image`,
    'verifyEmailPass': `${config.apiUrl}/user/resetpassword`,
    'changePassword': `${config.apiUrl}/resident/updatepassword`
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
  login(data) {
    return this.httpClient.post<any>(this.urls.login, data, this.httpOptions).pipe(
      map(res => res.response[0]),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getUserProfile(user_id) {
    return this.httpClient.post<any>(this.urls.get_profile, {user_id: user_id}, this.httpOptions).pipe(
        map(res => res.response[0]),
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
  verifyEmailPass(data) {
    return this.httpClient.post<any>(this.urls.verifyEmailPass, data, this.httpOptions).pipe(
        map(res => res),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
    changePassword(data) {
        return this.httpClient.post<any>(this.urls.changePassword, data, this.httpOptions).pipe(
            map(res => res),
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
