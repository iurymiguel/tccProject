import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HttpRequestProvider } from '../providers/http-request/http-request';
import { HttpClientModule} from '@angular/common/http';
import { LoadingProvider } from '../providers/loading/loading';
import { ToastProvider } from '../providers/toast/toast';
import { InterceptorModule } from '../providers/interceptor';
import { IonicStorageModule } from '@ionic/storage';
import { DragulaModule, DragulaService } from "ng2-dragula/ng2-dragula"


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    HttpClientModule,
    InterceptorModule,
    BrowserModule,
    IonicStorageModule.forRoot(),
    DragulaModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpRequestProvider,
    LoadingProvider,
    ToastProvider,
    DragulaService
  ]
})
export class AppModule {}
