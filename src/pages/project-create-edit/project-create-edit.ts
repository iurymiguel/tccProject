import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
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
  public data: any;
  public users: any[];
  public isEditing: boolean;
  public userData: any = {
    key: '',
    name: '',
  };
  public project: any = {
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
    public loadingCtrl: LoadingController, ) {

    this.data = navParams.get('data');
    console.log(this.data);
    this.isEditing = !!this.data;
    if (this.data) {
      this.project.key = this.data.key;
      this.project.name = this.data.name;
      this.project.description = this.data.description;
      this.project.projectTypeKey = this.data.projectTypeKey;
      this.userData = this.data.lead;
      console.log('JOKER', this.userData.key)
    }
  }

  public ionViewWillLoad() {
    this.getAllUsers();
  }

  /**
   * Busca todos os usuários
   */
  public getAllUsers() {
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    if (!this.showLoading) {
      this.loading.present();
      this.showLoading = true;
    }
    this.httpService.get(`${Config.REST_API}/group?groupname=jira-software-users&expand=users`)
      .then((result) => {
        this.users = result.users.items;
        this.loading.dismiss();
        this.showLoading = false;
        console.log(this.users);
      })
      .catch((error) => {
        console.log((error));
        this.loading.dismiss();
        this.showLoading = false;
        console.log("Falha ao buscar usuários");
      });
  }


  public createProject() {
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    if (!this.showLoading) {
      this.loading.present();
      this.showLoading = true;
    }
    this.project.lead = this.userData.name;
    this.httpService.post(Config.PROJECT_ENDPOINT, this.project)
      .then((res: any) => {
        this.getDeveloperRoleUrl(res.id);
        this.toast.show('Projeto criado com sucesso.');
      })
      .catch((error) => {
        console.log(error);
        this.loading.dismiss();
        this.showLoading = false;
        this.toast.show('Erro na requisição.');
      });
  }


  public editProject() {
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    if (!this.showLoading) {
      this.loading.present();
      this.showLoading = true;
    }
    this.project.lead = this.userData.name;
    this.httpService.put(Config.PROJECT_ENDPOINT + "/" + this.project.key, this.project)
      .then((res: any) => {
        this.getDeveloperRoleUrl(this.data.id);
        this.toast.show('Projeto editado com sucesso.');
      })
      .catch((error) => {
        console.log(error);
        this.loading.dismiss();
        this.showLoading = false;
        this.toast.show('Erro na edição do projeto.');
      });
  }

  private getDeveloperRoleUrl(projectId) {
    this.httpService.get(`${Config.REST_API}/project/${projectId}/role`)
      .then((result) => {
        const devUrl = result['Developer'];
        this.insertUser(devUrl);
      })
      .catch((error) => {
        console.log(error);
        this.loading.dismiss();
        this.showLoading = false;
        this.toast.show('Erro na requisição.');
      })
  }

  private insertUser(url) {
    url = url.replace('http://basetestejira.inatel.br:8080', '');
    this.httpService.post(url, { user: [this.userData.key] })
      .then((result) => {
        this.loading.dismiss();
        this.showLoading = false;
        this.navCtrl.pop();
      })
      .catch((error) => {
        console.log(error);
        this.loading.dismiss();
        this.showLoading = false;
        this.navCtrl.pop();
      });
  }

}
