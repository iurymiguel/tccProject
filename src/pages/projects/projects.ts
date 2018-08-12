import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher, PopoverController } from 'ionic-angular';

import { Config } from '../../config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastProvider } from '../../providers/toast/toast';
import { PopoverProjectPage } from './popover-project/popover-project';
import { HttpServiceProvider } from '../../providers/http-service/http-service';

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
    public popoverCtrl: PopoverController,
    public httpService: HttpServiceProvider) {
  }

  /**
   * @description Assim que entrar na página, a lista de projetos é carregada.
   */
  ionViewWillEnter() {
    this.getProjects();
  }

  public getProjects() {
    let loading;
    if (!this.refresher) {
      loading = this.loadingProvider.create('Carregando');
      loading.present();
      this.showLoading = true;
    }
    this.httpService.get(Config.REST_API + '/project?expand=description,lead,url,projectKeys')
      .then((result) => {
        this.projectsList = result;
        console.log(this.projectsList);
        this.dismissLoading(loading);
      })
      .catch((error) => {
        this.dismissLoading(loading);
      });
  }

  public presentPopover(event){
    const popover = this.popoverCtrl.create(PopoverProjectPage);
    popover.present({
      ev: event
    });
  }

  public doRefresh(refresher) {
    this.refresher = refresher;
    this.getProjects();
  }

  private dismissLoading(loading) {
    if (this.refresher) {
      this.refresher.complete();
    } else {
      loading.dismiss();
    }
    this.showLoading = false;
  }

}
