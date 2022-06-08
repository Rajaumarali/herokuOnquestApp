import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../config';
import { LocationService } from '../../property-listings/services/location.service';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResidentlistingService {

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
  constructor(private httpClient: HttpClient , private locationService: LocationService) { }
  
  getAllLocations() {
    return this.httpClient.get<any>(this.urls.get_all_locations, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
    }
}