import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Config } from '../../config/config';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Utils } from '../../utils';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastProvider } from '../../providers/toast/toast';
import { Storage } from '@ionic/storage';
import { HttpServiceProvider } from '../../providers/http-service/http-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public loginForm: FormGroup;
  public login: any;
  public bluredInputs: any;

  constructor(public navCtrl: NavController,
    public storage: Storage,
    public httpService: HttpServiceProvider,
    public formBuilder: FormBuilder,
    public loadingProvider: LoadingProvider,
    public toast: ToastProvider) {

    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.pattern(Utils.NO_SPACE_REGEX)]),
      password: new FormControl('', [Validators.required, Validators.pattern(Utils.NO_SPACE_REGEX)])
    });

    this.login = {
      username: '',
      password: ''
    };
    this.setBluredInputState(false);
  }

  /**
   * @description Faz o login na aplicação.
   */
  public doLogin() {
    if (this.loginForm.valid) {
      const loading = this.loadingProvider.create('Carregando');
      loading.present();
      this.httpService.post(Config.AUTH_ENDPOINT, this.login)
        .then((res: any) => {
          console.log(res);
          if(res.session){
            this.storage.set('authUser',res.session.value).then(() => {
              loading.dismiss().then(() => this.navCtrl.push('ProjectsPage'));
            })
          }
        })
        .catch((error) => {
          loading.dismiss();
          this.toast.show('Erro na requisição.');
        });
    } else {
      this.setBluredInputState(true);
    }
  }

  /**
   * @description Seta true ou false se os inputs pederam o foco.
   * @param state o estado do input.
   */
  private setBluredInputState(state: boolean) {
    this.bluredInputs = {
      isUsernameInputBlured: state,
      isPasswordInputBlured: state
    }
  }

}
