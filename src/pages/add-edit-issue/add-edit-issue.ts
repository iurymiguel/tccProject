import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ViewController, AlertController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Utils } from '../../utils/utils';
import { Config } from '../../config/config';
import { ToastProvider } from '../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-add-edit-issue',
  templateUrl: 'add-edit-issue.html',
})
export class AddEditIssuePage {

  public issue: any;
  public isEditing: boolean;
  public issueTypes: any[];
  public projectUsers: any[];
  public project: any;
  public loading: Loading;
  private summary: string;
  private assigneeName: string;
  private issueTypeId: string;
  private description: string;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toast: ToastProvider,
    public alertCtrl: AlertController,
    public http: HttpServiceProvider) {

    this.issue = this.navParams.get('issue');
    console.log('issue', this.issue);
    this.projectUsers = this.navParams.get('projectUsers');
    this.project = this.navParams.get('project');
    this.issueTypes = this.navParams.get('issueTypes');
    this.isEditing = !!this.issue;
    if(this.issue){
      this.summary = this.issue.fields.summary;
      this.assigneeName = this.issue.fields.assignee.name;
      this.issueTypeId = this.issue.fields.issuetype.id;
      this.description = this.issue.fields.description;
    }
  }

  public createIssue() {
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    this.loading.present();
    const body = {
      fields: {
        project: {
          id: this.project.id,
        },
        summary: this.summary,
        assignee: {
          name: this.assigneeName,
        },
        issuetype: {
          id: this.issueTypeId,
        },
        labels: [
          "todo"
        ],
        description: this.description,
      }
    };
    console.log(body);
    this.http.post(`${Config.REST_API}/issue`, body)
      .then((result) => {
        console.log(result);
        this.loading.dismiss();
        this.toast.show('Issue criada com sucesso').then(() => this.viewCtrl.dismiss());
      })
      .catch((error) => {
        console.log(error);
        this.loading.dismiss().then(() => this.toast.show('Erro na requisição.'));
      });
  }

  public editIssue() {
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    this.loading.present();

    const body = {
      fields: {
        project: {
          id: this.project.id,
        },
        summary: this.summary,
        assignee: {
          name: this.assigneeName,
        },
        issuetype: {
          id: this.issueTypeId,
        },
        description: this.description,
      }
    }

    this.http.put(`${Config.REST_API}/issue/${this.issue.id}`, body)
      .then((result) => {
        this.loading.dismiss();
        this.toast.show('Issue editada com sucesso').then(() => this.viewCtrl.dismiss());
      })
      .catch((error) => {
        this.loading.dismiss().then(() => this.toast.show('Erro na requisição.'));
      });
  }

  public confirmDelete(){
    const alert = this.alertCtrl.create({
      title: 'Confirmar Exclusão da Issue',
      message: `Deseja excluir essa issue do projeto?`,
      buttons: [
        {
          text: 'Sim',
          role: 'sim',
          handler: () => {
            this.deleteIssue();
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

  public deleteIssue() {
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    this.loading.present();
    this.http.delete(`${Config.REST_API}/issue/${this.issue.id}`)
      .then((result) => {
        this.loading.dismiss();
        this.toast.show('Issue deletada com sucesso').then(() => this.viewCtrl.dismiss());
      })
      .catch((error) => {
        this.loading.dismiss().then(() => this.toast.show('Erro na requisição.'));
      });
  }


}
