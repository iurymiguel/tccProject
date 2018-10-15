import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, LoadingController, Loading} from 'ionic-angular';
import { HttpServiceProvider } from '../../../providers/http-service/http-service';
import { Config } from '../../../config/config';
import { ToastProvider } from '../../../providers/toast/toast';
import { ProjectCreateEditPage } from '../../project-create-edit/project-create-edit';
/**
 * Generated class for the PopoverProjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover-project',
  templateUrl: 'popover-project.html',
})
export class PopoverProjectPage {
  
  public project:any;
  public loading: Loading;

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public httpService: HttpServiceProvider,
    public toast: ToastProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {

      this.project = this.navParams.get('project');

      console.log(this.project);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverProjectPage');
  }

  public showConfirmAlert(i) {
    let alert = this.alertCtrl.create({
      title: 'Excluir projeto',
      message: 'Deseja realmente excluir o projeto "' + this.project.name + '"?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.deleteProject();
          }
        }
      ]
    });
    alert.present();
  }

  public editProject(){
    this.navCtrl.push(ProjectCreateEditPage, {
      data: this.project
    });
  }

  public deleteProject(){
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    this.loading.present();
    this.httpService.delete(Config.PROJECT_ENDPOINT + "/" + this.project.key)
      .then((res: any) => {
        this.loading.dismiss();
        this.viewCtrl.dismiss();
        this.toast.show('Projeto excluído com sucesso.');
      })
      .catch((error) => {
        this.loading.dismiss();
        this.toast.show('Falha ao excluir o projeto.');
      });
  }

}
