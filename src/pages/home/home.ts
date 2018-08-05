import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpRequestProvider } from '../../providers/http-request/http-request';
import { Config } from '../../config/config';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Utils } from '../../utils';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastProvider } from '../../providers/toast/toast';
import { Storage } from '@ionic/storage';

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
    public http: HttpRequestProvider,
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

  public getProject() {
    this.http.get(Config.REST_API + '/user?username=tccinatel123@gmail.com')
      .then((res) => {
        console.log(JSON.parse(res));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * @description Faz o login na aplicação.
   */
  public doLogin() {
    if (this.loginForm.valid) {
      const loading = this.loadingProvider.create('Carregando...');
      loading.present();
      this.http.post(this.login, Config.AUTH_ENDPOINT)
        .then((res: any) => {
          console.log(res);
          if(res.session){
            this.storage.set('authUser',res.session.value).then(() => {
              this.toast.show(res.session.value);
              loading.dismiss();
            })
          }
        })
        .catch((error) => {
          console.log(error);
          loading.dismiss();
          this.navCtrl.push('KanbanPage');
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
