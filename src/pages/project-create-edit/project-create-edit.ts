import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading } from 'ionic-angular';
import { Storage } from '../../../node_modules/@ionic/storage';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { Config } from '../../config/config';
import { ToastProvider } from '../../providers/toast/toast';
import { LoadingProvider } from '../../providers/loading/loading';
import { ProjectsPage } from '../projects/projects';
@IonicPage()
@Component({
  selector: 'page-project-create-edit',
  templateUrl: 'project-create-edit.html',
})
export class ProjectCreateEditPage {

  private loading: Loading;
  public showLoading: boolean;

  public users: any[];
  public project: any ={
    key: '',
    name: '',
    projectTypeKey: '',
    description: '',
    lead: '',
  };

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public httpService: HttpServiceProvider,
     public toast: ToastProvider,
     public loadingProvider: LoadingProvider,) { 

      var data = navParams.get('data');

      if(data != null) {
        this.project.key = data.key;
        this.project.name = data.name;
        this.project.description = data.description;
        this.project.projectTypeKey = data.projectTypeKey;
        this.project.lead = data.lead;
      }

      console.log("project = " +  this.project.key);
    }

  ionViewWillEnter() {
    this.getAllUsers();
  }

  /**
   * Busca todos os usuários
   */
  public getAllUsers() {
    this.httpService.get(`${Config.REST_API}/group?groupname=jira-software-users&expand=users`)
      .then((result) => {
        this.users = result.users.items;
        console.log(this.users);
      })
      .catch((error) => {
        console.log("Falha ao buscar usuários");
      });
  }

/**
 * Cria ou edita projetos
 */
  public projectRequest() {
    

    /**
     * Se variável data for vazia, então cria projeto, senão edita o projeto existente
     */
    if(this.navParams.get('data') == null) {
      this.loading = this.loadingProvider.create('Carregando');
      if (!this.showLoading) {
        this.loading.present();
        this.showLoading = true;
      }
      this.httpService.post(Config.PROJECT_ENDPOINT, this.project)
      .then((res: any) => {
        this.toast.show('Projeto criado com sucesso.');

        this.navCtrl.push(ProjectsPage);
      })
      .catch((error) => {
        this.toast.show('Erro na requisição.');
      });
    } else {
      this.httpService.put(Config.PROJECT_ENDPOINT + "/" + this.project.key, this.project)
      .then((res: any) => {
        this.toast.show('Projeto editado com sucesso.');

        this.navCtrl.push(ProjectsPage);
      })
      .catch((error) => {
        this.toast.show('Erro na edição do projeto.');
      });
    }
  }

  public goToProjectPage() {
    this.navCtrl.push(ProjectsPage);
  }
}
