import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from "@shared/services/dialog.service";
import {Event} from "../../models/event.model";

@Component({
  selector: 'participants-view',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {

  @Input() event!: Event;

  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
  }

  openParticipantsView() {
  }

}
