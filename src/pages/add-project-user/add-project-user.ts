import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Refresher, AlertController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { Config } from '../../config/config';
import { ToastProvider } from '../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-add-project-user',
  templateUrl: 'add-project-user.html',
})
export class AddProjectUserPage {

  private projectUsers: any[];
  private systemUsers: any[];
  private url: string;
  private loading: Loading;
  private showLoading: boolean;
  private refresher: Refresher;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpServiceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toast: ToastProvider) {

    this.url = this.navParams.get('url');
    console.log(this.url);
    this.projectUsers = this.navParams.get('projectUsers');
  }

  public ionViewWillEnter() {
    this.systemUsers = new Array();
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    if (!this.showLoading) {
      this.loading.present();
      this.showLoading = true;
    }
    this.getAllUsers();
  }

  private getAllUsers() {
    this.http.get(`${Config.REST_API}/group?groupname=jira-software-users&expand=users`)
      .then((result) => {
        const users: any[] = result.users.items;
        if (users) {
          this.systemUsers = users.filter((user) => {
            const index = this.projectUsers.indexOf(user.key);
            return (index === -1);
          });
          this.dismissLoading();
        }
      })
      .catch((error) => {
        this.dismissLoading();
        this.toast.show('Erro na requisição.');
      });
  }

  public doRefresh(refresher) {
    this.refresher = refresher;
    this.getAllUsers();
  }

  public confirmAddUser(user: any) {
    const alert = this.alertCtrl.create({
      title: 'Confirmar Adição no Projeto',
      message: `Deseja inserir ${user.displayName} no projeto?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.insertUserInProject(user);
          },
        },
        {
          text: 'Não',
          handler: () => {
            alert.dismiss();
          },
        }
      ],
    });
  }

  private insertUserInProject(user: any){
    this.http.post(this.url, {user: [user.key]})
  }

  private dismissLoading() {
    if (this.refresher) {
      this.refresher.complete();
    } else {
      this.loading.dismiss();
    }
    this.showLoading = false;
  }

}
