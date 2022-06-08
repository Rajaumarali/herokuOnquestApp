import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { config } from '../../config';

@Injectable()
export class TicketService {
  private urls =  {
    'get_all_users':  `${config.apiUrl}/user/allusers`,
    'get_all_residents':  `${config.apiUrl}/user/getresidents`,
    'get_all_userProfiles': `${config.apiUrl}/user/allprofiles`,
    'get_all_services': `${config.apiUrl}/location/services/getbypropertycode`,
    'get_all_locations': `${config.apiUrl}/location/getall`,
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
  getAllServices(search) {
    return this.httpClient.post<any>(this.urls.get_all_services, search, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getAllResidents() {
    return this.httpClient.post<any>(this.urls.get_all_residents, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getAllCaptains(property_code) {
    return this.httpClient.post<any>(this.urls.get_all_users, property_code, this.httpOptions).pipe(
      map(res => res.response),
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
  getAllUserprofile(userId) {
    return this.httpClient.post<any>(this.urls.get_all_userProfiles, {user_id : userId}, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }

}
