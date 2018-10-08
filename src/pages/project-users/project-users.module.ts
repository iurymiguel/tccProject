import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectUsersPage } from './project-users';

@NgModule({
  declarations: [
    ProjectUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjectUsersPage),
  ],
})
export class ProjectUsersPageModule {}
