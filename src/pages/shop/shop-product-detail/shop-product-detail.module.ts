import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopProductDetailPage } from './shop-product-detail';

@NgModule({
  declarations: [
    ShopProductDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ShopProductDetailPage),
  ],
})
export class ShopProductDetailPageModule {}
