import { Injectable, NgModule } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { tap } from "rxjs/operators";

import { Config } from "../config/config";
import { Observable } from "rxjs";


@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {

    private headers = {
        'X-Atlassian-Token': 'no-check',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${Config.ADMIN_USERNAME}:${Config.ADMIN_PASSWORD}`)}`,
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const request = req.clone({ setHeaders: this.headers, withCredentials: true });
        return next.handle(request).pipe(tap(event => {
            console.log(event);
        }, error => {
            console.log(error)
        }));
    }
}
@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpsRequestInterceptor,
            multi: true,
        },
    ],
})
export class InterceptorModule { }