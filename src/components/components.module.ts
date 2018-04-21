import { NgModule } from '@angular/core';
import { MessagesComponent } from './messages/messages';

import { CalendarModule } from 'ionic3-calendar-en';
import { CalendarViewComponent } from './calendar-view/calendar-view';
@NgModule({
	declarations: [MessagesComponent,
    CalendarViewComponent],
	imports: [CalendarModule],
	exports: [MessagesComponent,
    CalendarViewComponent]
})
export class ComponentsModule {}
