import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { Config } from '../config/config';
import { Storage } from '@ionic/storage';
import { ProjectsPage } from '../pages/projects/projects';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    storage: Storage) {

    storage.get('authUser').then((value) => {
      if (value) {
        this.rootPage = ProjectsPage;
      }else{
        this.rootPage = HomePage;
      }
    });

    Config.IS_CORDOVA = platform.is('cordova');
    if (Config.IS_CORDOVA) {
      Config.API_URL = 'http://basetestejira.inatel.br:8080';
    }



    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

