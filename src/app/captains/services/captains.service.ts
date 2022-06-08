import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {AuthService} from '../../login/services/auth.service';
import { config } from '../../config';

@Injectable()
export class CaptainsService {
  private urls =  {
    'get_all_users':  `${config.apiUrl}/user/allusers`,
    'get_all_captains':  `${config.apiUrl}/user/getcaptains`,
    'get_all_userProfiles': `${config.apiUrl}/user/allprofiles`,
    'get_services_byUserId': `${config.apiUrl}/services/get`,
    'update_profile': `${config.apiUrl}/user/profile`,
    'create_users':  `${config.apiUrl}/user/signup`,
    'get_all_locations':  `${config.apiUrl}/location/getall`,
    'get_profile': `${config.apiUrl}/user/getuser`,
    'delete_captain': `${config.apiUrl}/user/delete`,
    'getPhoneNumbers': `${config.apiUrl}/user/message/getnumbers`,
    'purchaseNumber': `${config.apiUrl}/user/message/purchasenumber`
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
  constructor(private httpClient: HttpClient, private authservice:AuthService) {
  }
  getAllUsers(search) {
    return this.httpClient.post<any>(this.urls.get_all_users, search, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  purchaseNumber(num) {
    return this.httpClient.post<any>(this.urls.purchaseNumber, num, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getAllCaptains() {
    return this.httpClient.get<any>(this.urls.get_all_captains, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getPhoneNumbers() {
    return this.httpClient.get<any>(this.urls.getPhoneNumbers, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getAllUserprofile(userId) {
    return this.httpClient.post<any>(this.urls.get_all_userProfiles, {user_id : userId}, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getServiceByUserId(userId) {
    return this.httpClient.post<any>(this.urls.get_services_byUserId, {user_id : userId}, this.httpOptions).pipe(
      map(res => res.response),
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
  createCaptainUsers(data) {
    return this.httpClient.post<any>(this.urls.create_users, data, this.httpOptions).pipe(
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
  Uploadimage(img){
    return this.authservice.uploadDP(img);
  }
  delete(id) {
    return this.httpClient.post<any>(this.urls.delete_captain, {user_id: id}, this.httpOptions);
  }

}
