import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { Config } from "../config/config";

@Injectable()
export class MyInterceptor implements HttpInterceptor {

    private headers = {
        'X-Atlassian-Token':'no-check',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${Config.ADMIN_USERNAME}:${Config.ADMIN_PASSWORD}`)}`,
    }

    intercept(req: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
        const request = req.clone({ setHeaders: this.headers, withCredentials: true});
        console.log(request);
        return next.handle(request).do((event: HttpEvent<any>) => {
            console.log(event);
            return event;
          });
      }
}