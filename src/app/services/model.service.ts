import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
   providedIn: 'root'
})
export class ModelService {

   //baseUrl de requisições
   baseURL = "http://localhost/APIs/api_mestres/";

   constructor(public http: HttpClient) { }
}
