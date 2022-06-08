import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { config } from '../../config';

@Injectable()
export class TaskboardService {
  private urls =  {
    'get_all_users':  `${config.apiUrl}/user/allusers`,
    'get_all_residents':  `${config.apiUrl}/user/getresidents`,
    'get_all_userProfiles': `${config.apiUrl}/user/allprofiles`,
    'get_location': `${config.apiUrl}/building/get`,
    'get_services_byUserId': `${config.apiUrl}/services/get`,
    'update_profile': `${config.apiUrl}/user/profile`,
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
  constructor(private httpClient: HttpClient) {
  }


  getAllUsers(search) {
    return this.httpClient.post<any>(this.urls.get_all_users, search, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }

  updateProfile(data) {
    return this.httpClient.post<any>(this.urls.update_profile, data, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }

  getAllResidents() {
    return this.httpClient.get<any>(this.urls.get_all_residents, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getLocation(id) {
    return this.httpClient.post<any>(this.urls.get_location, id, this.httpOptions).pipe(
      map(res => res.response[0]),
      catchError(errorRes => {
        return throwError(errorRes);
      }));;
  }


}
