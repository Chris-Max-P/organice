import {Component, Input, OnInit} from '@angular/core';
import {Event} from "../../models/event.model";

@Component({
  selector: 'event-sidebar[events]',
  templateUrl: './event-sidebar.component.html',
  styleUrls: ['./event-sidebar.component.scss']
})
export class EventSidebarComponent implements OnInit {

  @Input() events: Event[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
