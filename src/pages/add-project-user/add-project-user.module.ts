import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProjectUserPage } from './add-project-user';

@NgModule({
  declarations: [
    AddProjectUserPage,
  ],
  imports: [
    IonicPageModule.forChild(AddProjectUserPage),
  ],
})
export class AddProjectUserPageModule {}
