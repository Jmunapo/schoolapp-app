import { Component, ViewChild, OnInit, Renderer, Input } from '@angular/core';
import { CommonsProvider } from '../../providers/commons/commons';
import { RemoteProvider } from '../../providers/remote/remote';
import { NavController } from 'ionic-angular';
import { ViewPage } from '../../pages/view/view';


@Component({
  selector: 'messages',
  templateUrl: 'messages.html'
})
export class MessagesComponent implements OnInit {
  smsReady = false;
  smsNum = 0;
  accordionExapanded = false;
  messages = []; // Array of messages
  messageEmpty = false;
  openedMsg = []; //Array of IDS os opened messages
  test_opened = []; //For read class
  @ViewChild("cc") cardContent: any;
  @Input('title') title: string;
  @Input('group') group: any;
  @Input('subdomain') subdomain: string;

  icon: string = "arrow-forward";

  constructor(public renderer: Renderer,
    private commons: CommonsProvider,
    private remote: RemoteProvider,
    public navCtrl: NavController) {

  }

  ngOnInit() {
    //console.log(this.cardContent.nativeElement);
    if(this.group){
      this.commons.getSavedmessages(this.group.segment).then(instorage =>{
        if (typeof (instorage) !== 'boolean') {
          this.messages = instorage;
        }
      });
      this.commons.getOpenedMsgsId(this.group.segment).then(ids =>{
        this.loadSms();
        if (typeof (ids) !== 'boolean'){
          this.openedMsg = ids;
          this.getOpened();
        }
      })
    }
    this.renderer.setElementStyle(this.cardContent.nativeElement, "webkitTransition", "max-height 500ms, padding 500ms");
  }

  toggleAccordion() {
    if (this.accordionExapanded) {
      this.renderer.setElementStyle(this.cardContent.nativeElement, "max-height", "0px");
      this.renderer.setElementStyle(this.cardContent.nativeElement, "padding", "0px 16px");

    } else {
      this.renderer.setElementStyle(this.cardContent.nativeElement, "max-height", "500px");
      this.renderer.setElementStyle(this.cardContent.nativeElement, "padding", "13px 16px");

    }

    this.accordionExapanded = !this.accordionExapanded;
    this.icon = this.icon == "arrow-forward" ? "arrow-down" : "arrow-forward";
  }

  loadSms(){
    this.remote.get_data(this.subdomain, this.group.posttype)
    .subscribe((data: any) => {
      if(data.length === 0){
        this.messageEmpty = true;
      }
      let msg = [];
      data.forEach(m => {
        let sms = {
          id: m.id,
          title: m.title.rendered,
          content: m.content.rendered,
          date: m.modified
        };
        msg.push(sms);
      });
      this.messages = msg;
      this.commons.saveMessages(this.group.segment, this.messages)
        .then(saved => {
          console.log(saved);
        });
      this.smsNum = data.length;
      this.smsReady = true;
    }, error => {
      this.commons.getSavedmessages(this.group.segment).then(instorage=>{
        if(typeof(instorage) !== 'boolean'){
          this.messages = instorage;
          this.smsReady = true;
        }else{
          this.messages = [];
          this.smsReady = true;
          this.messageEmpty = true;
        }
      })
      console.log(error);
    })
  }

  openMessage(msg){
    let b = this.openedMsg.findIndex(f => f === msg.id);
    if(b === -1){
      this.openedMsg.push(msg.id);
    }
    console.log(this.test_opened);
    this.test_opened[`${msg.id}_`] = true;
    this.commons.saveOpenedMsgsId(this.group.segment, this.openedMsg)
    .then(saved=>{
      console.log(saved);
      this.navCtrl.push(ViewPage, {
        massage: msg,
        type: 'read_msge'
      });
    })
  }

  getOpened(){
    this.messages.forEach(g => {
      console.log(g);
      this.test_opened[`${g.id}_`] = false;
    });
    this.openedMsg.forEach(a => {
      console.log(a);
      this.test_opened[`${a}_`] = true;
    });
  }
}