import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';


@Injectable()
export class CommonsProvider {
  constructor(public database: DatabaseProvider) {
    console.log('Hello CommonsProvider Provider');
  }

  getSelectedSchool(){
    return this.database.getData('selected_school');
  }
  setSelectedSchool(data: any) {
    return this.database.setData('selected_school', data);
  }
  getSavedGroups(domain: string){
    return this.database.getData(`${domain}_groups`);
  }
  saveGroups(domain: string, groups: Array<any>) {
    return this.database.setData(`${domain}_groups`, groups);
  }

  getSavedmessages(segment: string) {
    return this.database.getData(`${segment}_messages`);
  }

  saveMessages(segment: string, messages) {
    return this.database.setData(`${segment}_messages`, messages);
  }

  getOpenedMsgsId(segment: string) {
    return this.database.getData(`${segment}_opened`);
  }

  saveOpenedMsgsId(segment: string, ids: Array<any>){
    return this.database.setData(`${segment}_opened`, ids);
  }

}
