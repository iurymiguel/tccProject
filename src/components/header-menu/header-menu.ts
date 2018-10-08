import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { App, MenuController, Events, Nav } from 'ionic-angular';
import { Storage } from '../../../node_modules/@ionic/storage';
import { Utils } from '../../utils/utils';
/**
 * Generated class for the HeaderMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header-menu',
  templateUrl: 'header-menu.html'
})
export class HeaderMenuComponent {

  @Output() public onClickEvent: EventEmitter<string>;
  public currentPage: string;
  public pages = Utils.PAGES;

  public userData: any = {
    avatarUrls: '',
  };

  constructor(
    public menuCtrl: MenuController,
    public app: App,
    public storage: Storage,
    public events: Events) {

    this.onClickEvent = new EventEmitter<string>();

    this.watchUserData();
    this.watchItIsKanbanPage();
  }

  public watchItIsKanbanPage(){
    this.events.unsubscribe('kanbanPageOpen');
    this.events.subscribe('kanbanPageOpen', (swipeMenu) => {
      this.menuCtrl.swipeEnable(swipeMenu);
    })
  }

  public watchUserData() {
    this.events.unsubscribe('header-menu');
    this.events.subscribe('header-menu', (userData) => {
      this.userData = userData;
    });
  }

  ngOnDestroy(){
    console.log('destroy menu');
    this.events.unsubscribe('kanbanPageOpen');
    this.events.unsubscribe('header-menu');
  }

  @Input() set setCurrentName(currentPage){
    this.currentPage = currentPage;
    if(this.currentPage === this.pages.KANBAN_PAGE){
      this.menuCtrl.swipeEnable(false);
    }
  }

  public goToProjectUsersList(){
    this.events.publish('ProjectUsersList');
  }

  public goToProfilePage() {
    this.menuCtrl.close();
    this.onClickEvent.emit('ProfilePage');
  }

  public goBack(){
    this.menuCtrl.close();
    this.onClickEvent.emit('pop');
  }

  public logoutClicked() {
    this.menuCtrl.close();
    this.onClickEvent.emit('HomePage');
  }

}
