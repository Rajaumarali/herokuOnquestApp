import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {AuthService} from "../../login/services/auth.service";
import { config } from '../../config';

@Injectable()
export class MarketingImageService {
  private urls =  {
    'get_all_services':  `${config.apiUrl}/service/getall`,
    'get_service': `${config.apiUrl}/service/get`,
    'service_update': `${config.apiUrl}/service/update`,
    'service_delete': `${config.apiUrl}/service/delete`,
    'getAllProp': `${config.apiUrl}/location/getall`,



    'get_all_images':  `${config.apiUrl}/marketingimage/getall`,
    'get_images_byId':  `${config.apiUrl}/marketingimage/get`,
    'update_images':  `${config.apiUrl}/marketingimage/update`,
    'add_new_img': `${config.apiUrl}/marketingimage/add`,
    'delete_img':`${config.apiUrl}/marketingimage/delete`
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
  getAllImages() {
    return this.httpClient.get<any>(this.urls.get_all_images, this.httpOptions).pipe(
        map(res => res.response),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
  getAllProp(){
    return this.httpClient.get<any>(this.urls.getAllProp, this.httpOptions).pipe(
        map(res => res.response),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
  getImagebyId(id){
    return this.httpClient.post<any>(this.urls.get_images_byId, {marketing_image_id: id}, this.httpOptions).pipe(
        map(res => res.response[0]),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }
  updateImage(data){
      return this.httpClient.post<any>(this.urls.update_images, data, this.httpOptions).pipe(
          map(res => res.response[0]),
          catchError(errorRes => {
              return throwError(errorRes);
          }));
  }
  addNewImg(data){
    return this.httpClient.post<any>(this.urls.add_new_img, data, this.httpOptions).pipe(
        map(res => res.response[0]),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }

  delete(id) {
    return this.httpClient.post(this.urls.delete_img, {marketing_image_id: id}, this.httpOptions);
  }
  uploadImage(img){
     return this.authservice.uploadDP(img);
  }

}
