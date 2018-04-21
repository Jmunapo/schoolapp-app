import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagesPage } from './messages';
import { MessagesComponent } from '../../components/messages/messages';

@NgModule({
  declarations: [
    MessagesPage,
    MessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(MessagesPage),
  ],
})
export class MessagesPageModule {}
