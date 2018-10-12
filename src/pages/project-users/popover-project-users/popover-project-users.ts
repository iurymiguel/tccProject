import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, ToastController, ViewController, Events } from 'ionic-angular';
import { HttpServiceProvider } from '../../../providers/http-service/http-service';
import { Config } from '../../../config/config';
import { ToastProvider } from '../../../providers/toast/toast';

/**
 * Generated class for the PopoverProjectUsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover-project-users',
  templateUrl: 'popover-project-users.html',
})
export class PopoverProjectUsersPage {

  private user: any;
  private project: any;
  private loading: Loading;
  private roleId: number = 10200;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public http: HttpServiceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toast: ToastProvider,
    public events: Events,
  ) {

    this.user = this.navParams.get('user');
    this.project = this.navParams.get('project');
    console.log(this.user);
  }


  public deleteUser(){
    const alert = this.alertCtrl.create({
      title: 'Confirmar Exclusão no Projeto',
      message: `Deseja excluir ${this.user.displayName} do projeto?`,
      buttons: [
        {
          text: 'Sim',
          role: 'sim',
          handler: () => {
            this.deleteUserInProject(this.user);
          },
        },
        {
          text: 'Não',
          role: 'nao',
        }
      ],
    });
    alert.present();
  }


  private deleteUserInProject(user) {
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    this.loading.present();
    this.http.delete(`${Config.REST_API}/project/${this.project.id}/role/${this.roleId}?user=${user.name}`)
    .then((result) => {
      console.log(result);
      this.viewCtrl.dismiss();
      this.loading.dismiss();
      this.toast.show('Usuário excluido com sucesso');
      this.events.publish('updateProjectUsersList', this.user.name);
    })
    .catch((error) => {
      console.log(error);
      this.viewCtrl.dismiss();
      this.loading.dismiss();
      this.toast.show('Erro na requisição.');
    });
  }

}
