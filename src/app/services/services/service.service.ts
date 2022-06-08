import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {AuthService} from "../../login/services/auth.service";
import {config} from "../../config";
@Injectable()
export class ServiceService {
  
  private urls =  {
    'get_all_users':  `${config.apiUrl}/user/allusers`,
    'get_all_services':  `${config.apiUrl}/service/getall`,
    'get_service': `${config.apiUrl}/service/get`,
    'service_update': `${config.apiUrl}/service/update`,
    'service_delete': `${config.apiUrl}/service/delete`
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
  constructor(private httpClient: HttpClient ,private authservice: AuthService) {
  }
  getAllUsers(search) {
    return this.httpClient.post<any>(this.urls.get_all_users, search, this.httpOptions).pipe(
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
  getService(id) {
    return this.httpClient.post<any>(this.urls.get_service, {id: id}, this.httpOptions).pipe(
        map(res => res.response[0]),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
  serviceUpdate(data) {
    return this.httpClient.post<any>(this.urls.service_update, data, this.httpOptions).pipe(
        map(res => res.response[0]),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
  delete(id) {
    return this.httpClient.post(this.urls.service_delete, {id: id}, this.httpOptions);
  }
Uploadimage(img){
   return this.authservice.uploadDP(img);
}

}
