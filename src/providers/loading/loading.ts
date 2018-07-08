import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular/umd';

@Injectable()
export class LoadingProvider {

  constructor(public loadingCtrl: LoadingController) {
  }

  /**
   * @description Cria e retorna um loading.
   * @param msg A mensagem do loading.
   * @param time  Tempo máximo para Loading finalizar, não obrigatório.
   */
  public create(msg?: string, time?: number): Loading {
    const loading: Loading = this.loadingCtrl.create({
      content: msg,
      dismissOnPageChange: true,
      duration: time,
      spinner: 'crescent',
    });
    return loading;
  }

}
