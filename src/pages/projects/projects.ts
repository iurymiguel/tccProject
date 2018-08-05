import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Config } from '../../config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastProvider } from '../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {


  public showLoading: boolean;
  public refresher: Refresher;
  public projectsList: any[] = new Array();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public toastProvider: ToastProvider,
    public http: HttpRequestProvider) {
  }

  /**
   * @description Assim que entrar na página, a lista de projetos é carregada.
   */
  ionViewWillEnter() {
    this.getProjects();
  }

  public getProjects() {
    let loading;
    if(!this.refresher){
      loading = this.loadingProvider.create('Carregando');
      loading.present();
      this.showLoading = true;
    }
    this.http.get(Config.REST_API + '/project?expand=description,lead,url,projectKeys')
      .then((result) => {
        this.projectsList = result;
        console.log(this.projectsList);
        this.dismissLoading(loading);
      })
      .catch((error) => {
        this.dismissLoading(loading);        
      });
  }

  public dismissLoading(loading){
    if(this.refresher){
      this.refresher.complete();
    }else{
      loading.dismiss();
    }
    this.showLoading = false;
  }

  public doRefresh(refresher) {
    this.refresher = refresher;
    this.getProjects();
  }

}
