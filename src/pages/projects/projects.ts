import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher, PopoverController, Loading, Events, MenuController } from 'ionic-angular';

import { Config } from '../../config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastProvider } from '../../providers/toast/toast';
import { PopoverProjectPage } from './popover-project/popover-project';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { Storage } from '../../../node_modules/@ionic/storage';
import { Utils } from '../../utils/utils';
import { KanbanPage } from '../kanban/kanban';
import { HomePage } from '../home/home';
import { ProjectCreateEditPage } from '../project-create-edit/project-create-edit';

@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {

  public showLoading: boolean;
  public projectsList: any[] = new Array();
  public user: any;
  public isAdmin: boolean;
  private refresher: Refresher;
  private loading: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public toastProvider: ToastProvider,
    public popoverCtrl: PopoverController,
    public httpService: HttpServiceProvider,
    public storage: Storage,
    public menu: MenuController,
    public events: Events) {
  }

  /**
   * @description Assim que entrar na página, a lista de projetos é carregada.
   */
  public ionViewWillEnter() {
    this.menu.enable(true, 'menuApp');
    this.getUserDataFromStorage();
  }

  /**
   * @description Pega o username do local storage para fazer a requisição.
   */
  private getUserDataFromStorage() {
    this.loading = this.loadingProvider.create('Carregando');
    if (!this.showLoading) {
      this.loading.present();
      this.showLoading = true;
    }
    this.storage.get('authBase64').then((base64) => {
      const username = atob(base64).split(':')[0];
      this.getUser(username);
    });
  }

  /**
   * @description Vai para a página do kanban do projeto.
   * @param projectId projeto selecionado.
   */
  public goToProjectKanban(project) {
    this.navCtrl.push('KanbanPage', { project });
  }

  /**
   * @description Recupera dados do usuario logado.
   * @param username o username do usuário.
   */
  public getUser(username) {
    this.httpService.get(Config.REST_API +
      `/user?username=${username}&expand=groups,applicationRoles`)
      .then((result) => {
        console.log(result);
        this.storage.set('userData', result).then(() => {
          this.events.publish('header-menu', result);

          this.isAdmin = Utils.isAdmin(result);
          this.storage.set('isAdmin', this.isAdmin);
          this.getProjects();
        });
      })
      .catch((error) => {
        this.dismissLoading();
      });
  }

  /**
   * @description Recupera lista de projetos.
   */
  public getProjects() {
    const url = this.isAdmin ? '/project?expand=description,lead,url,projectKeys' : '/issue/createmeta';
    this.httpService.get(Config.REST_API + url)
      .then((result) => {
        console.log(result)
        if (result.projects) {
          this.projectsList = result.projects;
        } else {
          this.projectsList = result;
        }
        this.dismissLoading();
      })
      .catch((error) => {
        this.dismissLoading();
      });
  }

  /**
   * @description Abre popover contendo opções de editar e deletar.
   * @param event 
   */
  public presentPopover(event, project) {
    event.stopPropagation();
    const popover = this.popoverCtrl.create(PopoverProjectPage, {"project": project});
    popover.present({
      ev: event
    });
    popover.onDidDismiss(() => {
      this.showLoading = false;
      this.loading = this.loadingProvider.create('Carregando');
      this.loading.present();
      this.getProjects();
    });
  }

  /**
   * @description Atualiza a lista de projeto através do refresher.
   * @param refresher 
   */
  public doRefresh(refresher) {
    this.refresher = refresher;
    this.getProjects();
  }

  /**
   * @description Finaliza o loading.
   */
  private dismissLoading() {
    if (this.refresher) {
      this.refresher.complete();
    } else {
      this.loading.dismiss();
    }
    this.showLoading = false;
  }

  public openMenu() {
    this.menu.open('menuApp');
  }
  
  public createProjectPage() {
    this.navCtrl.push(ProjectCreateEditPage);
  }

}
