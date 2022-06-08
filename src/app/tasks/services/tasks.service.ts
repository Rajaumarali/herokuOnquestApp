import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { config } from '../../config';

@Injectable()
export class TasksService {
  private urls =  {
    'get_all_users':  `${config.apiUrl}/user/allusers`,
    'get_all_residents':  `${config.apiUrl}/user/getresidents`,
    'get_all_userProfiles': `${config.apiUrl}/user/allprofiles`,
    'get_all_services': `${config.apiUrl}/location/services/getbypropertycode`,
    'get_all_locations': `${config.apiUrl}/location/getall`,
    'get_all_captains': `${config.apiUrl}/user/getcaptains`,
    'complete_grocery': `${config.apiUrl}/grocerylist/update`,
    'complete_grocery_service': `${config.apiUrl}/grocerylistservice/update`,
    'complete_flower': `${config.apiUrl}/service/errandflowerdelivery/update`,
    'complete_flower_service': `${config.apiUrl}/service/errandflowerdeliveryservice/update`,
    'complete_rx_pay': `${config.apiUrl}/service/errandrxpickup/update`,
    'complete_laundry_pickup': `${config.apiUrl}/service/laundrypickup/update`,
    'complete_laundry_dropoff': `${config.apiUrl}/service/laundrydropoff/update`,
    'complete_package': `${config.apiUrl}/service/packagepickup/update`,
    'complete_onquestclean': `${config.apiUrl}/service/onquestclean/update`,
    'get_payment': `${config.apiUrl}/user/getpaymentdetails`,
    'complete_rx': `${config.apiUrl}/service/errandrxpickupservice/update`,
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
  getPayment(body) {
    return this.httpClient.post<any>(this.urls.get_payment, body, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  completeGrocery(search) {
    return this.httpClient.post<any>(this.urls.complete_grocery, search, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  completeGroceryService(search) {
    return this.httpClient.post<any>(this.urls.complete_grocery_service, search, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  completeFlower(search) {
    return this.httpClient.post<any>(this.urls.complete_flower, search, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  completeFlowerService(search) {
    return this.httpClient.post<any>(this.urls.complete_flower_service, search, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  completeRxPay(search) {
    return this.httpClient.post<any>(this.urls.complete_rx_pay, search, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  completeLaundryPickUp(search) {
    return this.httpClient.post<any>(this.urls.complete_laundry_pickup, search, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  completeLaundryDropOff(search) {
    return this.httpClient.post<any>(this.urls.complete_laundry_dropoff, search, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  completePackage(search) {
    return this.httpClient.post<any>(this.urls.complete_package, search, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  completeRx(search) {
    return this.httpClient.post<any>(this.urls.complete_rx, search, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  completeOnQuestClean(search) {
    return this.httpClient.post<any>(this.urls.complete_onquestclean, search, this.httpOptions).pipe(
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
  getAllPropertyCaptains() {
    return this.httpClient.get<any>(this.urls.get_all_captains).pipe(
        map(res => res.response),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }

}
