import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Refresher, PopoverController, Events } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { ToastProvider } from '../../providers/toast/toast';
import { Config } from '../../config/config';
import { Storage } from '@ionic/storage';
import { PopoverProjectUsersPage } from './popover-project-users/popover-project-users';

const ROLE = 'Developer';

@IonicPage()
@Component({
  selector: 'page-project-users',
  templateUrl: 'project-users.html',
})
export class ProjectUsersPage {

  public showLoading: boolean;
  public currentProject: any;
  public projectUsers: any[];
  private loading: Loading;
  private refresher: Refresher;
  private url: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public toast: ToastProvider,
    public popoverCtrl: PopoverController,
    public events: Events,
    public http: HttpServiceProvider) {

    this.currentProject = this.navParams.get('project');
    
    // this.storage.get('isAdmin').then((isAdmin) => {

    // });
  }

  public ionViewWillEnter() {
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    if (!this.showLoading) {
      this.loading.present();
      this.showLoading = true;
    }
    this.getProjectInfo();
    this.events.unsubscribe('updateProjectUsersList');
    this.events.subscribe('updateProjectUsersList', (name) => {
      this.projectUsers = this.projectUsers.filter((user) => user.name !== name);
    });
  }

  public ionViewWillLeave(){
    this.events.unsubscribe('updateProjectUsersList');
  }

  public goToAddUserPage() {
    const projectUsers = this.projectUsers.map((user) => user.name);
    console.log(projectUsers);
    this.navCtrl.push('AddProjectUserPage', { projectUsers, url: this.url });
  }

  public getProjectInfo() {
    this.http.get(`${Config.REST_API}/project/${this.currentProject.id}`)
      .then((res) => {
        this.url = res.roles[ROLE];
        this.getProjectUsersList();
      })
      .catch((error) => {
        this.dismissLoading();
        this.toast.show('Erro na requisição.');
      });
  }

  public getProjectUsersList() {
    this.url = this.url.replace('http://basetestejira.inatel.br:8080', '');
    this.http.get(this.url)
      .then((result) => {
        console.log(result);
        if (result.actors) {
          this.projectUsers = result.actors;
        }
        this.dismissLoading();
      })
      .catch((error) => {
        this.dismissLoading();
        this.toast.show('Erro na requisição.');
      });
  }

  public doRefresh(refresher) {
    this.refresher = refresher;
    this.getProjectUsersList();
  }

  private dismissLoading() {
    if (this.refresher) {
      this.refresher.complete();
    }
    this.loading.dismiss();
    this.showLoading = false;
  }


  public presentPopover(event, user) {
    event.stopPropagation();
    const popover = this.popoverCtrl.create(PopoverProjectUsersPage, { user , project: this.currentProject});
    popover.present({
      ev: event
    });
  }

}
