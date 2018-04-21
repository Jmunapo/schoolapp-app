import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopCheckoutPage } from './shop-checkout';

@NgModule({
  declarations: [
    ShopCheckoutPage,
  ],
  imports: [
    IonicPageModule.forChild(ShopCheckoutPage),
  ],
})
export class ShopCheckoutPageModule {}
