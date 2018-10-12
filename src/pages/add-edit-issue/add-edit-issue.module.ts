import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEditIssuePage } from './add-edit-issue';

@NgModule({
  declarations: [
    AddEditIssuePage,
  ],
  imports: [
    IonicPageModule.forChild(AddEditIssuePage),
  ],
})
export class AddEditIssuePageModule {}
