import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ViewController } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toast: ToastProvider,
    public http: HttpServiceProvider) {

    this.issue = this.navParams.get('issue');
    this.projectUsers = this.navParams.get('projectUsers');
    this.project = this.navParams.get('project');
    this.issueTypes = this.navParams.get('issueTypes');
    this.isEditing = !!this.issue;
    if (!this.issue) {
      this.issue = {
        fields: {
          project: {
            id: this.project.id,
          },
          summary: '',
          assignee: {
            name: ''
          },
          issuetype: {
            id: ''
          },
          labels: [
            "todo"
          ],
          description: '',
        }
      };
    }
    
  }


  public ionViewWillEnter() {

  }

  public createIssue(){
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    this.loading.present();
    console.log(this.issue);
    this.http.post(`${Config.REST_API}/issue`, this.issue)
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

  public editIssue(){

  }

  public deleteIssue(){
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
