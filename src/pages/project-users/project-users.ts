import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Refresher } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { ToastProvider } from '../../providers/toast/toast';
import { Config } from '../../config/config';

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
    public toast: ToastProvider,
    public http: HttpServiceProvider) {

    this.currentProject = this.navParams.get('project');
  }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    if (!this.showLoading) {
      this.loading.present();
      this.showLoading = true;
    }
    this.getProjectInfo();
  }

  public goToAddUserPage(){
    const projectUsers = this.projectUsers.map((user) => user.name);
    console.log(projectUsers);
    this.navCtrl.push('AddProjectUserPage', {projectUsers, url: this.url});
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
    this.url = this.url.replace('http://basetestejira.inatel.br:8080','');
    this.http.get(this.url)
      .then((result) => {

        console.log(result);
        if(result.actors){
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
    }else{
      this.loading.dismiss();
    }
    this.showLoading = false;
  }

}
