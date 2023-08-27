import {Component, Input, OnInit} from '@angular/core';
import {EventModel} from "../../models/event.model";

@Component({
  selector: 'event-sidebar[events]',
  templateUrl: './event-sidebar.component.html',
  styleUrls: ['./event-sidebar.component.scss']
})
export class EventSidebarComponent implements OnInit {

  @Input() events: EventModel[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
