import { Component, OnInit } from '@angular/core';
import {Event} from "./models/event.model";
import myEvents from '@assets/myEvents.json';
import {RestService} from "@shared/services/rest.service";

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  events: Event[] = [];

  constructor() { }

  ngOnInit(): void {
  }
}
