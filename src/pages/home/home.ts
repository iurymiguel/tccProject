import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Config } from '../../config/config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    public http: HttpRequestProvider) {

  }


  ionViewWillEnter() {

  }

  public getProject() {
    this.http.get(Config.REST_API + '/user?username=tccinatel123@gmail.com')
      .then((res) => {
        console.log(JSON.parse(res));
      })
      .catch((error) => {
        console.log(error);
      });
  }


  public createUser() {
    const body = {
      "username": "tccinatel123@gmail.com",
      "password":  "tccinatel2018"
    };
    this.http.post(body,Config.AUTH_ENDPOINT)
      .then((res: any) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
