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


  ionViewWillEnter(){
    this.getProject();
  }

  public getProject(){
    this.http.get('user/search?username=iurymiguel@gec.inatel.br')
    .then((res) => {
      console.log(JSON.parse(res));
    })
    .catch((error) => {
      console.log(error);
    });
  }

}
