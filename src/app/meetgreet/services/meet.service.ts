import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {Router} from '@angular/router';
import { config } from '../../config';

@Injectable()
export class MeetService {
  private urls =  {
    'get_all_users':  `${config.apiUrl}/user/allusers`,
    'user_prof':  `${config.apiUrl}/user/profile`
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
  constructor(private httpClient: HttpClient, private router: Router) {
  }

 
  getUsersByProperty(body) {
    return this.httpClient.post<any>(this.urls.get_all_users, body, this.httpOptions).pipe(
      map(res => res.response),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }
  completeMeetGreet(body) {
    return this.httpClient.post<any>(this.urls.user_prof, body, this.httpOptions).pipe(
      map(res => res),
      catchError(errorRes => {
        return throwError(errorRes);
      }));
  }

}
