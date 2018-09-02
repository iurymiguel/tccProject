import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { App, MenuController, Events, Nav } from 'ionic-angular';
//import { AuthServiceProvider } from '../../providers/auth/auth-service';
import { HomePage } from '../../pages/home/home';
import { Storage } from '../../../node_modules/@ionic/storage';
/**
 * Generated class for the HeaderMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header-menu',
  templateUrl: 'header-menu.html'
})
export class HeaderMenuComponent {

  public userData: any = {
    avatarUrls: '',
  };

  constructor(//public authService: AuthServiceProvider,
    public menuCtrl: MenuController,
    public app: App,
    public storage: Storage,
    public events: Events) {

    this.watchUserData();
  }

  watchUserData() {
    this.events.subscribe('header-menu', (userData) => {
      this.userData = userData;
      console.log(this.userData);
    });
  }

  logoutClicked() {
    this.menuCtrl.close();
    this.events.publish('logout');
   }

}
