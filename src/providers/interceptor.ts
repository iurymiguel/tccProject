import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class MyInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
        const headers = {
            'X-Atlassian-Token':'no-check',
            'Content-Type': 'application/json',
        };
        const request = req.clone({ setHeaders: headers, withCredentials: true});
        console.log(request);
        return next.handle(request).do((event: HttpEvent<any>) => {
            console.log(event);
            return event;
          });
      }
}