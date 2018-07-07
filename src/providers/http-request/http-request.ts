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
  
    public get(url: string, filter?: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.get(url)
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

    public post(data: any, url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.post(url, data)
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

    public put(data: any, url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.put(url, data)
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

    public patch(data: any, url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.patch(url, data)
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

    public delete(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.delete(url)
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