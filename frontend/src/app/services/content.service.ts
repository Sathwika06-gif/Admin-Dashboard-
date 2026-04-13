import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({providedIn:'root'})
export class ContentService{

 API='http://localhost:5000/api/content';

 constructor(private http:HttpClient){}

 add(data:any){
   return this.http.post(this.API,data);
 }

 getAll(){
   return this.http.get(this.API);
 }
}