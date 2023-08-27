import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from "@shared/services/dialog.service";
import {EventModel} from "../../models/event.model";

@Component({
  selector: 'participants-view',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {

  @Input() event!: EventModel;

  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
  }

  openParticipantsView() {
  }

}
