import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, NavController, App, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { Config } from '../config/config';
import { Storage } from '@ionic/storage';
import { ProjectsPage } from '../pages/projects/projects';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import { PerfilPage } from '../pages/perfil/perfil';
import { Utils } from '../utils/utils';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  @ViewChild('menuApp') nav: Nav;
  currentPage: string;
  rootPage: any;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    menu: MenuController,
    httpService: HttpServiceProvider,
    public storage: Storage,
    public events: Events) {

    storage.get('authUser').then((value) => {
      if (value) {
        this.rootPage = ProjectsPage;
        httpService.getBase64FromStorage();
        menu.enable(true, 'menuApp');
      } else {
        this.rootPage = HomePage;
        menu.enable(false, 'menuApp');
      }
    });

    Config.IS_CORDOVA = platform.is('cordova');
    if (Config.IS_CORDOVA) {
      Config.API_URL = 'http://basetestejira.inatel.br:8080';
    }

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.watchItIsKanbanPage();
    });
  }

  public watchItIsKanbanPage() {
    this.events.subscribe('kanbanPageOpen', () => {
      this.currentPage = Utils.PAGES.KANBAN_PAGE;
    });
  }

  public getCurrentPage() {
    this.currentPage = this.nav.getActive().name;
  }

  public onMenuClickEvent(event) {
    switch (event) {
      case Utils.PAGES.HOME_PAGE:
        this.storage.clear();
        this.nav.setRoot(HomePage);
        break;
      case 'pop':
        this.nav.pop();
        break;
      case 'ProfilePage':
        this.nav.push(PerfilPage);
    }
  }
}

