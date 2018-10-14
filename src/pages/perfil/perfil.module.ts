import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DragulaModule, DragulaService } from "ng2-dragula/ng2-dragula"
import { PerfilPage } from './Perfil';

@NgModule({
  declarations: [
    PerfilPage
  ],
  imports: [
    DragulaModule,
    IonicPageModule.forChild(PerfilPage),
  ],
  providers: [DragulaService]
})
export class PerfilPageModule {}
