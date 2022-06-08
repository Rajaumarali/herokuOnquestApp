import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {PropertyService} from '../../properties/services/property.service';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {LocationService} from "../../property-listings/services/location.service";
import { config } from '../../config';

@Injectable()
export class ResidentService {
  private urls =  {
    'get_all_users':  `${config.apiUrl}/user/allusers`,
    'get_property_info':  `${config.apiUrl}/building/get`,
    'get_all_residents':  `${config.apiUrl}/user/getresidents`,
    'get_all_userProfiles': `${config.apiUrl}/user/allprofiles`,
    'get_services_byUserId': `${config.apiUrl}/services/get`,
    'create_users':  `${config.apiUrl}/user/signup`,
    'send_email':  `${config.apiUrl}/email/send`,
    'get_all_locations':  `${config.apiUrl}/location/getall`,
    'get_all_services_base_upon_location': `${config.apiUrl}/location/services/getbypropertycode`,
    'delete_resident': `${config.apiUrl}/user/delete`,
    'get_notes': `${config.apiUrl}/user/notes/get`,
    'save_notes': `${config.apiUrl}/user/notes/create`,
    'update_notes': `${config.apiUrl}/user/notes/update`,
    'delete_notes': `${config.apiUrl}/user/notes/delete`,
    'groceryList': `${config.apiUrl}/groceryuseritems/get`,
    'flower_payment': `${config.apiUrl}/service/errandflowerdelivery/get`,
    'rx_payment': `${config.apiUrl}/service/errandrxpickup/get`,
    'grocery_payment': `${config.apiUrl}/grocerylist/get`
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
  constructor(private httpClient: HttpClient , private locationService: LocationService) {
  }
  getAllUsers(search) {
    return this.httpClient.post<any>(this.urls.get_all_users, search, this.httpOptions).pipe(
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
  getNotes(id) {
    return this.httpClient.post<any>(this.urls.get_notes, {user_id:id}, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getGroceryPayment(id){
    return this.httpClient.post<any>(this.urls.grocery_payment, {user_id:id}, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getFlowerPayment(id){
    return this.httpClient.post<any>(this.urls.flower_payment, {user_id:id}, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getRxPayment(id){
    return this.httpClient.post<any>(this.urls.rx_payment, {user_id:id}, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  saveNotes(data) {
    return this.httpClient.post<any>(this.urls.save_notes, data, this.httpOptions).pipe(
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
  getServiceByUserId(userId) {
    return this.httpClient.post<any>(this.urls.get_services_byUserId, {user_id : userId}, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  createResidentUsers(data) {
    return this.httpClient.post<any>(this.urls.create_users, data, this.httpOptions).pipe(
        map(res => res),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
  getPropertyInfo(propCode) {
    return this.httpClient.post<any>(this.urls.get_property_info, {property_code : propCode}, this.httpOptions).pipe(
      map(res => res.response[0]),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  sendEmail(data) {
    return this.httpClient.post<any>(this.urls.send_email, data, this.httpOptions).pipe(
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
  getLocation(id) {
    return this.locationService.getLocation(id);
  }
  getAllServiceByLocation(search) {
    return this.httpClient.post<any>(this.urls.get_all_services_base_upon_location, search, this.httpOptions).pipe(
        map(res => res.response),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
  delete(id) {
    return this.httpClient.post<any>(this.urls.delete_resident, {user_id: id}, this.httpOptions);
  }
  updateNotes(data) {
    return this.httpClient.post<any>(this.urls.update_notes, data, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  deleteNotes(data) {
    return this.httpClient.post<any>(this.urls.delete_notes, data, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  getGroceryListById(id) {
    return this.httpClient.post<any>(this.urls.groceryList, {list_id:id}, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
}
