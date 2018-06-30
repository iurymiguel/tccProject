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
    this.http.get('/user/search?username=iurymig.sht@gmail.com')
      .then((res) => {
        console.log(JSON.parse(res));
      })
      .catch((error) => {
        console.log(error);
      });
  }


  public createUser() {
    const body = {
        username: "iurymig.sht@gmail.com",
        password: "472372irm",
        // emailAddress: "iurymiguel@gec.inatel.br",
        // displayName: "iury da rocha miguel",
        // notification: "true"
    };

    this.http.post(body,Config.API_SESSION_URL)
      .then((res) => {
        console.log(JSON.parse(res));
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
