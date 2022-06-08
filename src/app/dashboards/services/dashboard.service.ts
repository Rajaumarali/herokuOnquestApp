import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { config } from '../../config';

@Injectable()
export class DashboardService {
    private urls =  {
        'get_all_resident_users':  `${config.apiUrl}/user/getresidents`,
        'get_all_services_lastWeek': `${config.apiUrl}/user/services/getall`,
        'get_all_concierges_users': `${config.apiUrl}/user/getcaptains`,
        'get_all_locations': `${config.apiUrl}/location/getall`,
        'get_all_captains': `${config.apiUrl}/user/getcaptains`,
        'get_all_downloads': `${config.apiUrl}/getappdownloads`,
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
    constructor(private httpClient: HttpClient ) {
    }
    getAllResidentUsers() {
        return this.httpClient.get<any>(this.urls.get_all_resident_users,this.httpOptions).pipe(
            map(res => res.response),
            catchError(errorRes => {
                return throwError(errorRes);
            }));
    }
    getAllLastWeekServices() {
        return this.httpClient.get<any>(this.urls.get_all_services_lastWeek, this.httpOptions).pipe(
            map(res => res),
            catchError(errorRes => {
                return throwError(errorRes);
            }));
    }
    getAllConciergesusers() {
        return this.httpClient.get<any>(this.urls.get_all_concierges_users,this.httpOptions).pipe(
            map(res => res.response),
            catchError(errorRes => {
                return throwError(errorRes);
            }));
    }
    getAllLocations() {
        return this.httpClient.get<any>(this.urls.get_all_locations,this.httpOptions).pipe(
            map(res => res.response),
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
    getAllDownloads() {
        return this.httpClient.get<any>(this.urls.get_all_downloads).pipe(
            map(res => res.response),
            catchError(errorRes => {
                return throwError(errorRes);
            }));
    }

}
