import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CommonsProvider } from '../../providers/commons/commons';


@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  messages: Array<any> = [];
  groups: Array<any> = [];
  subdomain: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public modal: ModalController,
    private commons: CommonsProvider) {
  }

  ionViewDidLoad() {
    this.commons.getSelectedSchool().then(data => {
      if (data) {
        this.subdomain = data.domain;
      }
      console.log(this.subdomain);
    }).then(()=>{
      this.commons.getSavedGroups(this.subdomain).then(data => {
        if(data){
          console.log(data);
          this.groups = data;
        }
      })
    })
    console.log('ionViewDidLoad MessagesPage');
  }
  addGroup(evnt){
    const subscribe = this.modal.create('SubscribePage',{
      subdomain: this.subdomain,
      myGroups: this.groups
    })
    subscribe.present();
    subscribe.onDidDismiss(data => {
      if (data) {
        console.log(data);
        this.groups = data;
        this.commons.saveGroups(this.subdomain, this.groups)
          .then(v=>{
            console.log(v);
          })
      }
    });
  }

}
