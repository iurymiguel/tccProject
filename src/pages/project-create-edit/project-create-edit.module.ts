import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectCreateEditPage } from './project-create-edit';

@NgModule({
  declarations: [
    ProjectCreateEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjectCreateEditPage),
  ],
})
export class ProjectCreateEditPageModule {}
