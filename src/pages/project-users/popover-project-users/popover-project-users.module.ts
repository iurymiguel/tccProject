import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverProjectUsersPage } from './popover-project-users';

@NgModule({
  declarations: [
    PopoverProjectUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverProjectUsersPage),
  ],
})
export class PopoverProjectUsersPageModule {}
