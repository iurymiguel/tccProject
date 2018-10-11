import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '../../../node_modules/@ionic/storage';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { Config } from '../../config/config';
import { ToastProvider } from '../../providers/toast/toast';
@IonicPage()
@Component({
  selector: 'page-project-create-edit',
  templateUrl: 'project-create-edit.html',
})
export class ProjectCreateEditPage {

  public users: any[];
  public project: any ={
    key: '',
    name: '',
    projectTypeKey: '',
    description: '',
    lead: '',
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public httpService: HttpServiceProvider, public toast: ToastProvider) { }

  ionViewWillEnter() {
    this.project = {
      key: '',
      name: '',
      projectTypeKey: '',
      description: '',
      lead: '',
    };
    this.getAllUsers();
  }

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

  public createProject() {
    debugger
    console.log(this.project);
    this.httpService.post(Config.CREATE_PROJECT, this.project)
      .then((res: any) => {
        this.toast.show('Projeto criado com sucesso.');
      })
      .catch((error) => {
        this.toast.show('Erro na requisição.');
      });
  }
}
