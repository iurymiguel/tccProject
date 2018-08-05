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
  rootPage: any = HomePage;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    storage: Storage) {

    if (platform.is('cordova')) {
      Config.API_URL = 'http://basetestejira.inatel.br:8080';
    }

    storage.get('authUser').then((value) => {
      if(value){
        this.rootPage = 'ProjectsPage';
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

