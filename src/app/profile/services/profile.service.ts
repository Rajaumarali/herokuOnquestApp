import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {AuthService} from "../../login/services/auth.service";
import { config } from '../../config';

@Injectable()
export class ProfileService {
  private urls =  {
    'get_all_locations':  `${config.apiUrl}/location/getall`,
    'changePass':  `${config.apiUrl}/resident/updatepassword`
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
  constructor(private httpClient: HttpClient,private authService : AuthService) {
  }
  getUserProfile(user_id) {
    return this.authService.getUserProfile(user_id);
  }
  updateUserProfile(data) {
    return this.authService.updateUserProfile(data);
  }
  uploadDP(formData) {
    return this.authService.uploadDP(formData);
  }
  checkPass(data){
    return this.authService.login(data);
  }
  updatePass(data){
    return this.authService.login(data);
  }
  changePass(data) {
    return this.httpClient.post<any>(this.urls.changePass, data).pipe(
        map(res => res),
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
}
