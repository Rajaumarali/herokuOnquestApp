import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {ResidentService} from "../../resident/services/resident.service";
import { config } from '../../config';

@Injectable()
export class ReportsService {
  private urls =  {
    'get_all_captains':  `${config.apiUrl}/user/getcaptains`,
    'get_all_residents':  `${config.apiUrl}/user/getresidents`,
    'get_all_userProfiles': `${config.apiUrl}/user/allprofiles`,
    'get_services_byUserId': `${config.apiUrl}/services/get`,
    'all_services':  `${config.apiUrl}/service/getall`,
    'get_all_locations': `${config.apiUrl}/location/getall`,
    'get_all_services': `${config.apiUrl}/location/services/getbypropertycode`,
    'get_all_downloads': `${config.apiUrl}/getappdownloads`,
    'get_all_restrictedS': `${config.apiUrl}/service/restricted/getall`,
    'getUsers':  `${config.apiUrl}/user/getconciergeadmin`,
    'getPayments':  `${config.apiUrl}/payment/getall`,
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
  getAllCaptains() {
    return this.httpClient.get<any>(this.urls.get_all_captains, this.httpOptions).pipe(
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
  getPayments() {
    return this.httpClient.get<any>(this.urls.getPayments, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  allServices() {
    return this.httpClient.get<any>(this.urls.all_services, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
}
getAllRestrictedService() {
  return this.httpClient.get<any>(this.urls.get_all_restrictedS, this.httpOptions).pipe(
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
  getAllServices(search) {
    return this.httpClient.post<any>(this.urls.get_all_services, search, this.httpOptions).pipe(
        map(res => res.response),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
  getUsers() {
    return this.httpClient.get<any>(this.urls.getUsers, this.httpOptions).pipe(
        map(res => res.response),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
  getAllDownloads() {
    return this.httpClient.get<any>(this.urls.get_all_downloads).pipe(
        map(res => res.response),
        catchError(errorRes => {
            return throwError(errorRes);
        }));
}
}
