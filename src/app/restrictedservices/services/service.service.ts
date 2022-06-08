import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {LocationService} from "../../property-listings/services/location.service";
import { config } from '../../config';

@Injectable()
export class ServiceService {
  private urls =  {
    'create_restrictedS':  `${config.apiUrl}/service/restricted/create`,
    'get_all_restrictedS': `${config.apiUrl}/service/restricted/getall`,
    'get_all_services': `${config.apiUrl}/service/getall`,
    'update_restricted_services': `${config.apiUrl}/service/restricted/update`,
    'get_restricted_service': `${config.apiUrl}/service/restricted/get`,
    'delete_restrictedS': `${config.apiUrl}/service/restricted/delete`
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
  constructor(private httpClient: HttpClient, private locationservice: LocationService) {
  }
  createRestrictedS(data) {
    return this.httpClient.post<any>(this.urls.create_restrictedS, data, this.httpOptions).pipe(
        map(res => res.response[0]),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
  updateRestrictedS(data) {
    return this.httpClient.post<any>(this.urls.update_restricted_services, data, this.httpOptions).pipe(
        map(res => res.response[0]),
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
  getAllServices() {
    return this.httpClient.get<any>(this.urls.get_all_services, this.httpOptions).pipe(
        map(res => res.response),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
  getRestrictedService(id) {
    return this.httpClient.post<any>(this.urls.get_restricted_service, {id: id}, this.httpOptions).pipe(
        map(res => res.response[0]),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
    delete(id) {
    return this.httpClient.post<any>(this.urls.delete_restrictedS, {id: id}, this.httpOptions);
  }
  getAlllocations() {
    return this.locationservice.getAllLocations();
  }

}
