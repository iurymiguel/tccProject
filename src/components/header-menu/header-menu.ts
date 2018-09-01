import { Component } from '@angular/core';
import { App, Nav, MenuController, Events } from 'ionic-angular';
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

  public userData;

  constructor(//public authService: AuthServiceProvider,
    public menuCtrl: MenuController,
    public app: App,
    public storage: Storage,
    public events: Events) {
  }

  watchUserData() {
    this.events.subscribe('header-menu', (userData)=> {
      this.userData = userData;
    });
  }

  logoutClicked() {
    console.log("Logout");
    //this.authService.logout();
    this.menuCtrl.close();
    var nav = this.app.getRootNav();
    nav.setRoot(HomePage);
  }

}
