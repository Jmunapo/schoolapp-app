import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RemoteProvider } from '../../providers/remote/remote';
import { DatabaseProvider } from '../../providers/database/database';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Events } from 'ionic-angular/util/events';
import { TabsPage } from '../tabs/tabs';
import { OneSignal } from '@ionic-native/onesignal';


@Component({
  selector: 'page-switch-school',
  templateUrl: 'switch-school.html',
})
export class SwitchSchoolPage {
  show: string = 'list';
  instorage: boolean; //check if there is anything in storage 
  search: string = '';
  hideSearchbar: boolean = true;
  all_schools: Array<any> = [];
  saved_schools: Array<any> = [];
  media_url: Array<any> = [];
  user_data: any;
  constructor(
    public onesiginal: OneSignal,
    public event: Events,
    public loader: LoadingController,
    public remote: RemoteProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public database: DatabaseProvider,
    public toaster: ToastController) {
    let user_data = this.navParams.get('user');
    if (user_data) {
      this.user_data = user_data;
    }
  }

  ionViewWillLoad() {
    this.load_all_schools();
    this.load_saved_schools();
  }

  toggleSearchbar() {
    this.hideSearchbar = !this.hideSearchbar;
  }

  search_schlools(){

  }

  //load all schools from the info server
  load_all_schools(){
    this.remote.get_schools()
      .subscribe(schools => {
        if (schools) {
          const xuls = schools.map(xul => {
            const meta = xul['school-meta'];
            let schoolArr = {
              id: xul.id,
              name: meta['school-name'][0],
              city: meta['school-city'][0],
              address: meta['school-address'][0],
              cell: meta['school-cell'][0],
              email: meta['school-email'][0],
              level: meta['school-level'][0],
              location: meta['school-location'][0],
              tel: meta['school-tel'][0],
              domain: meta['school-domain'][0],
              motto: meta['school-motto'][0],
              logo: meta['school-logo'][0]
            };
            return schoolArr;
          });
          this.all_schools = xuls;
          console.log(this.all_schools);
        }
      },
      err => {
        alert(JSON.stringify(err));
      })
  }
  load_saved_schools(){
    this.database.getData('schools').then(val => {
      if (val) {
        this.instorage = true;
        this.saved_schools = val;
      }else{
        this.show = 'all';
      }
    })
  }

  add_my_school(arr){
    let b = this.saved_schools.findIndex(f => f.id === arr.id);
    if (this.saved_schools.length >= 3){
      let msg = 'You cannot add more than 3 Schools';
      this.show = 'list';
      this.show_toaster(msg,'middle');
    }else if(b !== -1){
      let msg = this.my_sanitizer(arr.id) + ' already added';
      this.show_toaster(msg);
    } else if (b === -1 && this.saved_schools.length < 3){
      this.user_subscribe(arr);
    }
    
  }

  remove_my_school(arr){
    let msg;
    this.database.getData('selected_school').then(val=>{
      if(val){
        if(arr.id === val.id){
          msg = 'You Cannot Remove selected School';
          this.show_toaster(msg, 'middle')
        }else{
          let b = this.saved_schools.findIndex(f => f.id === arr.id);
          this.saved_schools.splice(b, 1);
          msg = this.my_sanitizer(arr.id) + ' Removed';
          if (this.saved_schools.length === 0) {
            this.instorage = false;
            this.show = 'all';
            this.database.removeData('schools');
          } else {
            this.database.setData('schools', this.saved_schools);
          }
          this.show_toaster(msg)
        }
      }else{
        let b = this.saved_schools.findIndex(f => f.id === arr.id);
        this.saved_schools.splice(b, 1);
        msg = this.my_sanitizer(arr.id) + ' Removed';
        if (this.saved_schools.length === 0) {
          this.instorage = false;
          this.show = 'all';
          this.database.removeData('schools');
        } else {
          this.database.setData('schools', this.saved_schools);
        }
        this.show_toaster(msg)
      }
    }) 
    
  }

  show_toaster(msg, pos='bottom') {
    let toast = this.toaster.create({
      message: msg,
      position: pos,
      duration: 4000
    });
    toast.present();
}

  my_sanitizer(id){
    return document.getElementById(id).innerHTML;
  }

  select_school(arr){
    this.database.getData('selected_school').then(val => {
      if (val) {
        this.onesiginal.deleteTag(val.subdomain);
      }
      this.onesiginal.sendTag(arr.subdomain, '1')
      this.database.setData('selected_school', arr).then(val => {
        if (val) {
          let msg = this.my_sanitizer(arr.id) + ' Selected';
          this.show_toaster(msg)
          this.navCtrl.setRoot(TabsPage, {
            sw_user: this.user_data
          });
        } else {
          this.show_toaster('Not selected, Unexpected error please restart the APP');
        }
      })
    });
  }


  user_subscribe(arr) {
    let loader = this.loader.create({
      content: 'Loading...',
      duration: 11000,
      spinner: 'bubbles',
    });
    loader.present();
    let subdomain = arr.domain;
    this.remote.user_get_nonce(subdomain).subscribe(val => {
      if (val) {
        let nonce = (JSON.parse(val)).nonce;
        let data = this.user_data;
        data['nonce']= nonce;
        this.remote.user_subscribe(data,subdomain).subscribe(reg=>{
              if(reg){
                let msg = this.my_sanitizer(arr.id) + ' added to your List';
                this.instorage = true;
                this.saved_schools.push(arr);
                this.database.setData('schools', this.saved_schools).then(set=>{
                  if(set){
                    loader.dismiss();
                    this.show_toaster(msg);
                  }
                });
              }
            },
          err=>{
            if(err.error.error === 'Username already exists.'){
              //Add to favourites
              let msg = this.my_sanitizer(arr.id) + ' added to your List';
              this.instorage = true;
              this.saved_schools.push(arr);
              this.database.setData('schools', this.saved_schools).then(set => {
                if (set) {
                  loader.dismiss();
                  this.show_toaster(msg);
                }
              });
            }else{
              loader.dismiss();
              alert(JSON.stringify(err));
              this.show_toaster('Error adding to your list Try Later');
            }
          })

      }
    },
      err => {
        alert(JSON.stringify(err));
        let msg = 'Sorry you can\'t add at the moment, try Later!'
        loader.dismiss();
        this.show_toaster(msg);
      })
  }


}
