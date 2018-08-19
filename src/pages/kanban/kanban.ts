import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DragulaService } from "ng2-dragula/ng2-dragula"
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Config } from '../../config/config';

@IonicPage()
@Component({
  selector: 'page-kanban',
  templateUrl: 'kanban.html'
})
export class KanbanPage {

  public projectId: string;
  q1 = [];
  q2 = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dragulaService: DragulaService,
    private screen: ScreenOrientation,
  ) {

    if (Config.IS_CORDOVA) {
      this.screen.lock(this.screen.ORIENTATIONS.LANDSCAPE);
    }

    this.projectId = this.navParams.get('projectId');
    console.log(this.projectId);

    for (var i = 0; i < 5; i++) {
      this.q1.push("1...." + i)
    }


    dragulaService.drop.subscribe((value) => {
      console.log(value)
    });

    // this is to prevent 'bag already exists error'
    // https://github.com/valor-software/ng2-dragula/issues/442
    const bag: any = this.dragulaService.find('bag');
    if (bag !== undefined) this.dragulaService.destroy('bag');

    dragulaService.setOptions('bag', {
      resetOnSpill: true
    });

  }

  public ionViewWillLeave(){
    this.screen.unlock();
  }

}
