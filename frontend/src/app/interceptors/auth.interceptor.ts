import { HttpInterceptor } from '@angular/common/http';

export class AuthInterceptor implements HttpInterceptor{
 intercept(req:any,next:any){
   return next.handle(req);
 }
}