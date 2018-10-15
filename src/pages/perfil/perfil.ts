import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '../../../node_modules/@ionic/storage';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  public user: any = {

    avatar: '',
    displayName: '',
    email: '',
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage) {

      this.storage.get('userData').then((val) => {
        
        this.user.avatar = val.avatarUrls['48x48'];
        this.user.displayName = val.displayName;
        this.user.email = val.emailAddress;
      });

      console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

}
