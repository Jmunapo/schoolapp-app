import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { RemoteProvider } from '../../../providers/remote/remote';
import { OneSignal } from '@ionic-native/onesignal';

@IonicPage()
@Component({
  selector: 'page-subscribe',
  templateUrl: 'subscribe.html',
})
export class SubscribePage {
  groups: Array<any> = [];
  myGroups: Array<any> =[];
  test_checked = [];
  hasError = false;
  ready: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private remote: RemoteProvider,
    public alertCtrl: AlertController,
    private oneSignal: OneSignal,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscribePage');
    this.getGroups(this.navParams.get('subdomain'));
    this.myGroups = this.navParams.get('myGroups');
  }

  getGroups(subdomain: string) {
    if(subdomain){
      this.remote.get_school_groups(subdomain)
      .subscribe((groups: any) => {
        this.groups = groups;
        this.groups.forEach(g => {
          this.test_checked[g.posttype] = false;
        });
        this.myGroups.forEach(a => {
          this.test_checked[a.posttype] = true;
        });
        this.ready = true;
      }, error =>{
        this.ready = true;
        this.hasError = true;
      })
    }
  }

  checkSubs(posttype){
    let b = this.myGroups.findIndex(f => f.posttype === posttype);
    if(b > - 1){
      return true;
    }
    return false;
  }

  switched(event: any, group: any){
    let sub = event.checked;
    let message = (sub) ? 'Are you sure you want to receive messages and notifications from this group?' :
     'Are you sure you want to stop receiving message and notifications from this group?';
    let confirm = this.alertCtrl.create({
      message: message,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.test_checked[group.posttype] = !this.test_checked[group.posttype];
          }
        },
        {
          text: 'Yes',
          handler: () => {
            if(sub){
              this.oneSignal.sendTag(group.segment, '1')
            }else{
              this.oneSignal.deleteTag(group.segment)
            }
          }
        }
      ]
    });
    confirm.present();
  }

  saveChanges() {
    if(this.hasError){
      this.myGroups = this.myGroups;
      this.viewCtrl.dismiss(this.myGroups);
    }else{
      this.myGroups = this.groups.filter(a => {
        return this.test_checked[a.posttype];
      })
      this.viewCtrl.dismiss(this.myGroups);
    }
  }

}
