import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController, ModalController, LoadingController, Loading, Label } from 'ionic-angular';
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
  public fromArray: any[] = [];
  public toArray: any[] = [];
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
  public issueMoved: any;
  public readonly statusKey: any[] = ['to-do', 'doing', 'to-test', 'testing', 'done'];

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
      console.log(value);
      const issueId = value[1].id;
      const from: string = value[3].id;
      const to: string = value[2].id;
      const body = {
        update: {
          fields: {
            labels: [
              to
            ]
          }
        }
      }
      if (from !== to) {
        this.issueMoved = this.fromArray.filter((issue) => issue.id === issueId);
        this.loading = this.loadingCtrl.create({ content: 'Aguarde' });
        this.loading.present();
        this.http.delete(`${Config.REST_API}/issue/${issueId}`)
          .then((result) => {
            const body = {
              fields: {
                project: {
                  id: this.project.id,
                },
                summary: this.issueMoved[0].fields.summary,
                assignee: {
                  name: this.issueMoved[0].fields.assignee.name,
                },
                issuetype: {
                  id: this.issueMoved[0].fields.issuetype.id,
                },
                labels: [
                  to
                ],
                description: this.issueMoved[0].fields.description,
              }
            };
            console.log(body)
            this.http.post(`${Config.REST_API}/issue`, body)
              .then((result) => {
                console.log(result)
                this.loading.dismiss();
                this.toast.show(`Issue movida de ${from} para ${to}`);
              })
              .catch((error) => {
                this.loading.dismiss();
                this.handleIssueError(from, to);
                this.toast.show('Erro na requisicao');
              });

          })
          .catch((error) => {
            this.loading.dismiss();
            this.handleIssueError(from, to);
            this.toast.show('Erro na requisicao');
          });
      }
    });

    this.onDragSubsription = this.dragulaService.drag.subscribe((value) => {
      this.isDragging = true;
      const from: string = value[2].id;

      switch (from) {
        case 'to-do':
          this.fromArray = this.toDoIssues;
          break;
        case 'doing':
          this.fromArray = this.doingIssues;
          break;
        case 'to-test':
          this.fromArray = this.toTestIssues;
          break;
        case 'testing':
          this.fromArray = this.testingIssues;
          break;
        case 'done':
          this.fromArray = this.doneIssues;
          break;
      }
    });

    this.onDragEndSubscription = this.dragulaService.dragend.subscribe((value) => {
      this.isDragging = false;
    });
  }

  public handleIssueError(from, to) {
    switch (to) {
      case 'to-do':
        this.toDoIssues = this.toDoIssues.filter((issue) => issue.id !== this.issueMoved[0].id);
        break;
      case 'doing':
        this.doingIssues = this.doingIssues.filter((issue) => issue.id !== this.issueMoved[0].id);
        break;
      case 'to-test':
        this.toTestIssues = this.toTestIssues.filter((issue) => issue.id !== this.issueMoved[0].id);
        break;
      case 'testing':
        this.testingIssues = this.testingIssues.filter((issue) => issue.id !== this.issueMoved[0].id);
        break;
      case 'done':
        this.doneIssues = this.doneIssues.filter((issue) => issue.id !== this.issueMoved[0].id);
        break;
    }

    switch (from) {
      case 'to-do':
        this.toDoIssues.push(this.issueMoved[0]);
        break;
      case 'doing':
        this.doingIssues.push(this.issueMoved[0]);
        break;
      case 'to-test':
        this.toTestIssues.push(this.issueMoved[0]);
        break;
      case 'testing':
        this.testingIssues.push(this.issueMoved[0]);
        break;
      case 'done':
        this.doneIssues.push(this.issueMoved[0]);
        break;
    }


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
        this.organizeIssues(result.issues);
        console.log(result.issues)
        this.loading.dismiss();
      })
      .catch((error) => {
        console.log(error);
        this.loading.dismiss().then(() => this.toast.show('Erro na requisição.'));
      });
  }

  public organizeIssues(issues: any[]) {
    this.toDoIssues = [];
    this.doingIssues = [];
    this.toTestIssues = [];
    this.testingIssues = [];
    this.doneIssues = [];
    issues.forEach((issue) => {
      let issueStatus = undefined;
      console.log('labels', issue.fields.labels);
      for (let label of issue.fields.labels) {
        for (let status of this.statusKey) {
          if (label === status) {
            issueStatus = label;
            break;
          }
        }
      }
      if (!issueStatus) {
        issueStatus = 'to-do';
        issue.fields.labels = [issueStatus];
      }

      switch (issueStatus) {
        case 'to-do':
          this.toDoIssues.push(issue);
          break;
        case 'doing':
          this.doingIssues.push(issue);
          break;
        case 'to-test':
          this.toTestIssues.push(issues);
          break;
        case 'testing':
          this.testingIssues.push(issue);
          break;
        case 'done':
          this.doneIssues.push(issue);
          break;
      }
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

