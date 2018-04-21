import { Component } from '@angular/core';

/**
 * Generated class for the CalendarViewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'calendar-view',
  templateUrl: 'calendar-view.html'
})
export class CalendarViewComponent {

  text: string;

  constructor() {
    console.log('Hello CalendarViewComponent Component');
    this.text = 'Hello World';
  }

}
