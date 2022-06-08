import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { config } from '../../config';

@Injectable()
export class PropertyService {
  private urls =  {
    'get_all_residents':  `${config.apiUrl}/user/allusers`,
    'get_all_services':  `${config.apiUrl}/location/services/getbypropertycode`,
    'delete_location':  `${config.apiUrl}/location/delete`,
    'get_location': `${config.apiUrl}/building/get`,
    'update_location': `${config.apiUrl}/location/update`,
    'delete_captain': `${config.apiUrl}/user/delete`
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
  getAllResidents(property_code) {
    return this.httpClient.post<any>(this.urls.get_all_residents,property_code, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getAllServices(property_code) {
    return this.httpClient.post<any>(this.urls.get_all_services, property_code, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  // delete(id) {
  //   return this.httpClient.post<any>(this.urls.delete_location, {building_id: id}, this.httpOptions);
  // }
  getLocation(id) {
    return this.httpClient.post<any>(this.urls.get_location, {property_code: id}, this.httpOptions).pipe(
      map(res => res.response[0]),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  updateLocation(data) {
    return this.httpClient.post<any>(this.urls.update_location, data, this.httpOptions).pipe(
      map(res => res.response[0]),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  delete(id) {
    return this.httpClient.post<any>(this.urls.delete_captain, {user_id: id}, this.httpOptions);
  }
}
