import { Injectable } from '@angular/core';
import { ToastController, Toast } from 'ionic-angular';


@Injectable()
export class ToastProvider {

  private toast: Toast;

  constructor(public toastCtrl: ToastController) {
  }

  /**
   * @description Cria e exibe um toast na tela.
   * @param msg A mensagem do Toast.
   * @param dismissOnPageChange Determina se um toast vai finalizar ao mudar de página.
   * @param time Tempo de aparição do toast.
   * @param cssClass css do toast.
   */
  public show(msg: string, dismissOnPageChange: boolean = true, time?: number, cssClass?: string): Promise<void> {
    this.toast = this.toastCtrl.create({
      cssClass,
      dismissOnPageChange,
      duration: time || 3000,
      message: msg,
    });
    return this.toast.present();
  }

  /**
   * @description Finaliza um toast.
   */
  public dismiss(): Promise<void> {
    return this.toast.dismiss();
  }

}
