import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController, ModalController, LoadingController, Loading } from 'ionic-angular';
import { DragulaService } from "ng2-dragula/ng2-dragula"
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Config } from '../../config/config';
import autoScroll from 'dom-autoscroller';
import * as $ from 'jquery';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { ToastProvider } from '../../providers/toast/toast';

const ROLE = 'Developer';

@IonicPage()
@Component({
  selector: 'page-kanban',
  templateUrl: 'kanban.html'
})
export class KanbanPage {

  toDoIssues = [];
  doingIssues = [];
  toTestIssues = [];
  testingIssues = [];
  doneIssues = [];
  public project: any;
  private loading: Loading;
  public drake: any;
  private isDragging: boolean = false;
  private onDropSubscription: any;
  private onDragSubsription: any;
  private onDragEndSubscription: any;
  private issueTypes: any = [];
  private projectUsers: any = [];
  private url: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dragulaService: DragulaService,
    private screen: ScreenOrientation,
    public menu: MenuController,
    public loadingCtrl: LoadingController,
    public http: HttpServiceProvider,
    public modalCtrl: ModalController,
    public toast: ToastProvider,
    public events: Events,
  ) {

    this.project = this.navParams.get('project');
    console.log(this.project);

    for (var i = 0; i < 15; i++) {
      this.toDoIssues.push("1...." + i)
    }

    this.subscribeDragulaEvents();
    this.dragulaSettings();
  }

  public openMenu() {
    this.menu.open('menuApp');
  }

  public ionViewWillEnter() {
    if (Config.IS_CORDOVA) {
      this.screen.lock(this.screen.ORIENTATIONS.LANDSCAPE);
    }
    this.events.publish('kanbanPageOpen', false);
    this.watchProjectUsers();
    this.getIssues();
  }

  public ngAfterViewInit() {
    const _this = this;

    autoScroll([
      document.querySelector('#grid'),
    ], {
        margin: 30,
        maxSpeed: 40,
        scrollWhenOutside: true,
        autoScroll: function () {
          return this.down && _this.isDragging;
        }
      });
  }

  private dragulaSettings() {
    const bag: any = this.dragulaService.find('bag');
    if (bag !== undefined) this.dragulaService.destroy('bag');
    this.dragulaService.setOptions('bag', {
      revertOnSpill: true,
    });
  }

  private subscribeDragulaEvents() {
    this.onDropSubscription = this.dragulaService.drop.subscribe((value) => {
      this.isDragging = false;
      this.setColumnsHeight();
    });

    this.onDragSubsription = this.dragulaService.drag.subscribe((value) => {
      this.isDragging = true;
    });

    this.onDragEndSubscription = this.dragulaService.dragend.subscribe((value) => {
      this.isDragging = false;
    });
  }

  public ionViewWillLeave() {
    this.screen.unlock();
    this.events.publish('kanbanPageOpen', true);
    this.events.unsubscribe('kanbanPageOpen');
  }

  public ngOnDestroy() {
    this.unsubscribeDragulaEvents();
  }

  private unsubscribeDragulaEvents() {
    this.onDropSubscription.unsubscribe();
    this.onDragSubsription.unsubscribe();
    this.onDragEndSubscription.unsubscribe();
  }

  private setColumnsHeight() {
    const columns = document.getElementsByClassName('kanban-col');
    console.log(columns);
  }

  private watchProjectUsers() {
    this.events.unsubscribe('ProjectUsersList');
    this.events.subscribe('ProjectUsersList', () => {
      this.menu.close();
      this.navCtrl.push('ProjectUsersPage', { project: this.project });
    });
  }

  private getIssues() {
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    this.loading.present();
    this.http.get(`${Config.REST_API}/search?jql=project=${this.project.key}`)
      .then((result) => {
        console.log(result);
        this.loading.dismiss();
      })
      .catch((error) => {
        console.log(error);
        this.loading.dismiss().then(() => this.toast.show('Erro na requisição.'));
      });
  }

  public editIssue(issue) {
    this.getIssuesType(issue);
  }

  public presentAddEditIssueModal(issue) {
    const rangeModal = this.modalCtrl.create('AddEditIssuePage',
      {
        issue, project: this.project, issueTypes: this.issueTypes,
        projectUsers: this.projectUsers
      },
      {
        cssClass: 'issue-modal',
        enableBackdropDismiss: true,
        showBackdrop: true,
      });
    rangeModal.present();
  }

  private getIssuesType(issue) {
    this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
    this.loading.present();
    this.http.get(`${Config.REST_API}/issuetype`)
      .then((result) => {
        this.issueTypes = (result) ? result : [];
        this.getProjectInfo(issue);
      })
      .catch((error) => {
        console.log(error);
        this.loading.dismiss().then(() => this.toast.show('Erro na requisição.'));
      });
  }

  public getProjectInfo(issue) {
    this.http.get(`${Config.REST_API}/project/${this.project.id}`)
      .then((res) => {
        this.url = res.roles[ROLE];
        this.getProjectUsersList(issue);
      })
      .catch((error) => {
        console.log(error);
        this.loading.dismiss().then(() => this.toast.show('Erro na requisição.'));
      });
  }

  public getProjectUsersList(issue) {
    this.url = this.url.replace('http://basetestejira.inatel.br:8080', '');
    this.http.get(this.url)
      .then((result) => {
        console.log(result);
        if (result.actors) {
          this.projectUsers = result.actors;
        }
        this.loading.dismiss().then(() => this.presentAddEditIssueModal(issue));
      })
      .catch((error) => {
        this.loading.dismiss().then(() => this.toast.show('Erro na requisição.'));
      });
  }

}
