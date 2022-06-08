import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { config } from '../../config';

@Injectable()
export class LocationService {
    private urls =  {
        'get_all_locations':  `${config.apiUrl}/location/getall`,
        'create_location':  `${config.apiUrl}/location/create`,
        'delete_location':  `${config.apiUrl}/location/delete`,
        'get_location': `${config.apiUrl}/building/get`,
        'update_location': `${config.apiUrl}/location/update`,
        'get_all_restrictedS': `${config.apiUrl}/service/restricted/getall`,
        'get_all_services':  `${config.apiUrl}/service/getall`,
        'create_restrictedS':  `${config.apiUrl}/service/restricted/create`,
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
    constructor(private httpClient: HttpClient) {
    }
    getAllLocations() {
        return this.httpClient.get<any>(this.urls.get_all_locations, this.httpOptions).pipe(
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
    getAllServices() {
        return this.httpClient.get<any>(this.urls.get_all_services, this.httpOptions).pipe(
          map(res => res.response),
          catchError(errorRes => {
            return throwError(errorRes);
          }));
    }

    createRestrictedS(data) {
        return this.httpClient.post<any>(this.urls.create_restrictedS, data, this.httpOptions).pipe(
            map(res => res.response[0]),
            catchError(errorRes => {
              return throwError(errorRes);
            }));
      }

    createLocation(data) {
        return this.httpClient.post<any>(this.urls.create_location, data, this.httpOptions).pipe(
            map(res => res.response),
            catchError(errorRes => {
                return throwError(errorRes);
            }));
    }
    delete(bid, propid) {
        return this.httpClient.post<any>(this.urls.delete_location, {building_id: bid, property_code: propid}, this.httpOptions);
    }
    deleteRestrictionS(id) {
        return this.httpClient.post<any>(this.urls.delete_restrictedS, {id: id}, this.httpOptions);
      }
    getLocation(id) {
        return this.httpClient.post<any>(this.urls.get_location, {property_code: id}, this.httpOptions).pipe(
            map(res => res.response[0]),
            catchError(errorRes => {
                return throwError(errorRes);
            }));;
    }
    updateLocation(data) {
        return this.httpClient.post<any>(this.urls.update_location, data, this.httpOptions).pipe(
            map(res => res.response[0]),
            catchError(errorRes => {
                return throwError(errorRes);
            }));;
    }
}
