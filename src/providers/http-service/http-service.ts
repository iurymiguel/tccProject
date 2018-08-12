import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { Config } from '../../config/config';
import { Storage } from '@ionic/storage';
import { Observable } from '../../../node_modules/rxjs';

@Injectable()
export class HttpServiceProvider {

  private static header;

  constructor(
    public httpClient: HttpClient,
    public http: HTTP,
    public storage: Storage) {

    this.http.setDataSerializer('json');
  }

  /**
   * @description Se for login, prepara o header de requisições.
   * @param url a url referente ao login da aplicação.
   * @param body o body da requisição contento o username e a senha.
   */
  private authenticateUser(url, body) {
    if (url === Config.API_URL + Config.AUTH_ENDPOINT) {
      if (body && body.username && body.password) {
        const base64 = btoa(`${body.username}:${body.password}`);
        HttpServiceProvider.header = {
          'X-Atlassian-Token': 'no-check',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${base64}`,
        }
        this.storage.set('authBase64', base64);
      }
    }
  }


  /**
   * @description Método que faz requisições POST para o cordova e o browser.
   * @param url a url do endpoint.
   * @param body o body da requisição.
   */
  public post(url: string, body: any): Promise<any> {
    if (Config.IS_CORDOVA) {
      this.authenticateUser(Config.API_URL + url, body);
      return new Promise<any>((resolve, reject) => {
        this.http.post(Config.API_URL + url, body, HttpServiceProvider.header)
          .then((result) => {
            result.data = JSON.parse(result.data);
            resolve(result.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    } else {
      return new Promise<any>((resolve, reject) => {
        this.httpClient.post(Config.API_URL + url, body)
          .timeoutWith(Config.TIMEOUT, Observable.throw({ error: { statusCode: 504, message: 'timeout' } }))
          .toPromise()
          .then((response: any) => {
            resolve(response);
          }).catch(error => {
            reject(error);
          });
      });
    }
  }

  /**
   * @description Método que faz requisições GET para o cordova e o browser.
   * @param url a url do endpoint.
   * @param body o body da requisição.
   */
  public get(url: string): Promise<any> {
    if (Config.IS_CORDOVA) {
      return new Promise<any>((resolve, reject) => {
        this.http.get(Config.API_URL + url, {}, HttpServiceProvider.header)
          .then((result) => {
            result.data = JSON.parse(result.data);
            resolve(result.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    } else {
      return new Promise<any>((resolve, reject) => {
        this.httpClient.get(Config.API_URL + url)
          .timeoutWith(Config.TIMEOUT, Observable.throw({ error: { statusCode: 504, message: 'timeout' } }))
          .toPromise()
          .then((response: any) => {
            resolve(response);
          }).catch(error => {
            reject(error);
          });
      });
    }
  }

}
