import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeoutWith';

import { LocalStorageProvider } from '../local-storage';
import { Config } from '../../config/config';

/**
 * @description Class responsible to manage Http Requests.
 */
@Injectable()
export class HttpRequestProvider {

    constructor(
        public http: Http
    ) {

    }

    /**
     * @description Method responsible to set the options with headers.
     */
    private getRequestOptions(filter?: any) {
        const options = new RequestOptions();

        const headers = new Headers({
            'X-Atlassian-Token': 'no-check',
            'Content-Type': 'application/json',
        })
        console.log(headers)
        options.headers = headers;

        if (filter) {
            const params = new URLSearchParams();
            params.set('filter', JSON.stringify(filter));
            options.params = params;
        }

        return options;
    }

    /**
     * @description Method responsible to make a GET request.
     * @param {url} the url used in the request.
     */
    public get(url: string, filter?: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.get(url, this.getRequestOptions(filter))
                .toPromise().then((response: any) => {
                console.log('ddd',response);
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
     * @description Method responsible to make a POST request.
     * @param {data} data the body of the request.
     * @param {url} the url used in the request.
     */
    public post(data: any, url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.post(url, data, this.getRequestOptions())
                .timeoutWith(Config.TIMEOUT, Observable.throw({error: {statusCode: 504, message: 'timeout'}}))
                .toPromise().then((response: any) => {
                if (response.status == '200') {
                    resolve(response._body);
                } else {
                    reject(response._body);
                }
            }).catch(err => {
                if(err._body){
                    reject(err._body);
                } else{
                    reject(err);
                }
            });
        });
    }

     /**
     * Method responsible to make a PUT request.
     * @param {data} data which will be sent.
     * @param {url} the url used in the request.
     */
    public put(data: any, url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.put(url, data, this.getRequestOptions())
            .toPromise().then((response: any) => {
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
     * Method responsible to make a PATCH request.
     * @param {data} data which will be sent.
     * @param {url} the url used in the request.
     */
    public patch(data: any, url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.patch(url, data, this.getRequestOptions()).toPromise().then((response: any) => {
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
     * Method responsible to make a DELETE request.
     * @param {data} data which will be sent.
     * @param {url} the url used in the request.
     */
    public delete(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.delete(url, this.getRequestOptions())
            .toPromise().then((response: any) => {
                console.log(response);
                if (response.status == '200') {
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
}