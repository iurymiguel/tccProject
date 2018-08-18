import { Injectable, NgModule } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { Config } from "../config/config";
import { Observable } from "rxjs";
import { Storage } from '@ionic/storage';

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {

    private static headers: any;
    constructor(private storage: Storage){}

    /**
     * @description Constrói header ao logar na aplicação.
     * @param request requisição http.
     */
    private authenticateUser(request) {
        if (request.url === Config.API_URL + Config.AUTH_ENDPOINT && request.method === 'POST') {
            if (request.body && request.body.username && request.body.password) {
                const base64 = btoa(`${request.body.username}:${request.body.password}`);
                HttpsRequestInterceptor.headers = {
                    'X-Atlassian-Token': 'no-check',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${base64}`,
                }
                this.storage.set('authBase64', base64);
            }
        }
    }

    /**
     * @description Intercepta requisição e resposta http.
     * @param req Requisição enviada.
     * @param next objeto que trata de interceptar.
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.authenticateUser(req);
        const request = req.clone({ setHeaders: HttpsRequestInterceptor.headers, withCredentials: true });
        return next.handle(request).pipe(tap(event => {
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