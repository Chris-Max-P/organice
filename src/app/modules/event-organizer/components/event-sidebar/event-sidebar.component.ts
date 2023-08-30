import {Component, Input, OnInit} from '@angular/core';
import {Event} from "../../models/event.model";
import {RestService} from "@shared/services/rest.service";
import {EventService} from "@shared/services/event.service";

@Component({
  selector: 'event-sidebar',
  templateUrl: './event-sidebar.component.html',
  styleUrls: ['./event-sidebar.component.scss']
})
export class EventSidebarComponent implements OnInit {

  constructor(public eventService: EventService) { }

  ngOnInit(): void {
  }

  setEvent(event: Event) {
    this.eventService.currentEvent = event;
  }

  protected readonly event = event;
}
