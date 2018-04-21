import { Component, trigger, state, style, animate, transition } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: '0' })),
      state('*', style({ opacity: '1' })),
      transition('void <=> *', animate('150ms ease-in'))
    ])
  ]
})
export class ShopPage {
  WooCommerce: any;
  categories: Array<any> = [];
  categoryReady: boolean = false;
  showError: boolean = false;
  constructor(
    public modal: ModalController,
    public navCtrl: NavController, 
    private wp: WoocommerceProvider,
    public loader: LoadingController,
    public toaster: ToastController) {
    this.WooCommerce = this.wp.init();
  }

  ionViewDidLoad(){
    this.WooCommerce.getAsync('products/categories').then(res => {
      this.categories = JSON.parse(res.body).product_categories.sort(function (a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) { return -1; }
        if (nameA > nameB) { return 1;  }
        return 0;
      });
    })
    this.loadData(0);
  }
   /** 
     * @times
     * number to count reloading
     * Woocommerce async loading having an error of not
     * refreshing the dom after loaded
     */
  loadData(times: number){
    let t = times + 1;
    if(t > 10){
      this.showError = true;
      return;
    }else{
      if (this.categories.length === 0) {
        setTimeout(() => {
          this.loadData(t);
        }, 1000)
      } else {
        this.categoryReady = true;
        this.showError = false;
        this.categories = this.categories;
      }
    }
  }

  open(item){
    let category = item.toLowerCase();
    let loader = this.loader.create({
      content: `Loading ${category}...`,
      duration: 11000,
      spinner: 'dots',
    });
    loader.present();
    this.WooCommerce.getAsync(`products?filter[category]=${category}`).then((data) => {
      try {
        let products = JSON.parse(data.body).products;
        if (products.length > 0) {
          loader.dismiss();
          this.navCtrl.push('ShopCategoryPage', {
            item: item,
            products: products
          })
        } else {
          let toast = this.toaster.create({
            message: 'Sorry! No ' + category + ' found',
            position: 'middle',
            duration: 5000
          });
          loader.dismiss();
          toast.present();
        }
      } catch (error) {
        let toast = this.toaster.create({
          message: 'Error! Check your internet',
          position: 'middle',
          duration: 5000
        });
        loader.dismiss();
        toast.present();
        console.log(error);
      }
      
    }, (err) => {
      console.log(err)
      let toast = this.toaster.create({
        message: 'Error loading ' + category,
        position: 'middle',
        duration: 5000
      });
      loader.dismiss();
      toast.present();
    })
    

    
  }
  view_cart() {
    const subscribe = this.modal.create('ShopCartPage');
    subscribe.present();
    subscribe.onDidDismiss(data => {
      if (data) {
        console.log(data);
      }
    })
  }
  
}
