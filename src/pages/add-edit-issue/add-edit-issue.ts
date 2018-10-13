import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Utils } from '../../utils/utils';

/**
 * Generated class for the AddEditIssuePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-edit-issue',
  templateUrl: 'add-edit-issue.html',
})
export class AddEditIssuePage {

  public issue: any;
  public isEditing: boolean;
  private formGroup: FormGroup;
  public bluredInputs: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public http: HttpServiceProvider) {

      this.formGroup = this.formBuilder.group({
        summary : new FormControl('', [Validators.required, Validators.pattern(Utils.NO_SPACE_REGEX)]),
        assignee: new FormControl('', [Validators.required, Validators.pattern(Utils.NO_SPACE_REGEX)]),
      });
      this.issue = this.navParams.get('issue');
      this.isEditing = !!this.issue;
      this.setBluredInputState(false);
  }


  public ionViewWillEnter(){
  
  }


  private insertIssue(){
    if(this.formGroup.valid){

    }else{
      this.setBluredInputState(false);
    }
  }
  
  /**
   * @description Seta true ou false se os inputs pederam o foco.
   * @param state o estado do input.
   */
  private setBluredInputState(state: boolean) {
    this.bluredInputs = {
      isSummaryInputBlured: state,
      isAssigneeInputBlured: state
    }
  }


}
