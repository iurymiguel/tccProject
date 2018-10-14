import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { DragulaService } from "ng2-dragula/ng2-dragula"
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Config } from '../../config/config';
import autoScroll from 'dom-autoscroller';
import * as $ from 'jquery';
@IonicPage()
@Component({
  selector: 'page-kanban',
  templateUrl: 'kanban.html'
})
export class KanbanPage {

  public projectId: string;
  q1 = [];
  q2 = [];
  q3 = [];
  q4 = [];
  q5 = [];
  
  public drake: any;
  private isDragging: boolean = false;
  private onDropSubscription: any;
  private onDragSubsription: any;
  private onDragEndSubscription: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dragulaService: DragulaService,
    private screen: ScreenOrientation,
    public menu: MenuController,
    public events: Events,
  ) {

    if (Config.IS_CORDOVA) {
      this.screen.lock(this.screen.ORIENTATIONS.LANDSCAPE);
    }

    this.projectId = this.navParams.get('projectId');
    console.log(this.projectId);

    for (var i = 0; i < 15; i++) {
      this.q1.push("1...." + i)
    }

    this.subscribeDragulaEvents();
    this.dragulaSettings();
  }

  public openMenu(){
    this.menu.open('menuApp');
  }

  public ionViewWillEnter(){
    this.events.publish('kanbanPageOpen', false);
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
  }

  public ngOnDestroy() {
    this.unsubscribeDragulaEvents();
  }

  private unsubscribeDragulaEvents() {
    this.onDropSubscription.unsubscribe();
    this.onDragSubsription.unsubscribe();
    this.onDragEndSubscription.unsubscribe();
  }

  private setColumnsHeight(){
    const columns = document.getElementsByClassName('kanban-col');
    console.log(columns);
  }
}
