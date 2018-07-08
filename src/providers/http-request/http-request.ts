import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeoutWith';

import { Config } from '../../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpRequestProvider {

    constructor(public http: HttpClient) {
    }

    /**
     * @description Método responsável por fazer requisções do tipo GET.
     * @param url A url especificada.
     */
    public get(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.get(Config.API_URL + url)
                .toPromise()
                .then((response: any) => {
                    if (response.status === 200) {
                        resolve(response._body);
                    } else {
                        reject(response._body);
                    }
                }).catch(err => {
                    console.log(err);
                    reject(err._body);
                });
        });
    }

    /**
     * @description Método responsável por fazer requisções do tipo POST.
     * @param data Dados que vão no body da requisição.
     * @param url A url especificada.
     */
    public post(data: any, url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.post(Config.API_URL + url, data)
                .timeoutWith(Config.TIMEOUT,
                    Observable.throw({ error: { statusCode: 504, message: 'timeout' } }))
                .toPromise()
                .then((response: any) => {
                    if (response.status == '200') {
                        resolve(response._body);
                    } else {
                        reject(response._body);
                    }
                }).catch(err => {
                    console.log(err);
                    if (err._body) {
                        reject(err._body);
                    } else {
                        reject(err);
                    }
                });
        });
    }

    /**
     * @description Método responsável por fazer requisções do tipo PUT.
     * @param data Dados que vão no body da requisição.
     * @param url A url especificada.
     */
    public put(data: any, url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.put(Config.API_URL + url, data)
                .toPromise()
                .then((response: any) => {
                    if (response.status == '200') {
                        resolve(response._body);
                    } else {
                        reject(response._body);
                    }
                }).catch(err => {
                    reject(err._body);
                });
        });
    }

    /**
     * @description Método responsável por fazer requisções do tipo PATCH.
     * @param data Dados que vão no body da requisição.
     * @param url A url especificada.
     */
    public patch(data: any, url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.patch(Config.API_URL + url, data)
                .toPromise()
                .then((response: any) => {
                    if (response.status == '200') {
                        resolve(response._body);
                    } else {
                        reject(response._body);
                    }
                }).catch(err => {
                    reject(err._body);
                });
        });
    }

    /**
     * @description Método responsável por fazer requisções do tipo DELETE.
     * @param url A url especificada.
     */
    public delete(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.delete(Config.API_URL + url)
                .toPromise()
                .then((response: any) => {
                    if (response.status == '200') {
                        resolve(response._body);
                    } else {
                        reject(response._body);
                    }
                }).catch(err => {
                    reject(err._body);
                });
        });
    }
}