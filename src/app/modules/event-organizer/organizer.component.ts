import { Component, OnInit } from '@angular/core';
import {EventModel} from "./models/event.model";
import myEvents from '@assets/myEvents.json';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  events: EventModel[] = [];

  constructor() { }

  ngOnInit(): void {
    for (let myEvent of myEvents.events) {
      this.events.push(new EventModel(myEvent.name, myEvent.participants));
    }
  }
}
