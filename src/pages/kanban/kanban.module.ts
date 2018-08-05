import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DragulaModule, DragulaService } from "ng2-dragula/ng2-dragula"
import { KanbanPage } from './kanban';

@NgModule({
  declarations: [
    KanbanPage
  ],
  imports: [
    DragulaModule,
    IonicPageModule.forChild(KanbanPage),
  ],
  providers: [DragulaService]
})
export class KanbanPageModule {}
