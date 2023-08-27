import { Component, OnInit } from '@angular/core';
import {Event} from "./models/event.model";
import myEvents from '@assets/myEvents.json';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  events: Event[] = [];

  constructor() { }

  ngOnInit(): void {
    for (let myEvent of myEvents) {
      // @ts-ignore
      this.events.push(new Event(myEvent.name, myEvent.participants));
    }
  }
}
