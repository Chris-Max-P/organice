import {Component, Input, OnInit} from '@angular/core';
import {Event} from "../../models/event.model";
import {Participant} from "../../models/participant.model";
import {HttpClient} from "@angular/common/http";
import {Answer} from "../../models/answer.enum";
import {RestService} from "@shared/services/rest.service";
import {EventService} from "@shared/services/event.service";

@Component({
  selector: 'event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit {

  event: Event;
  yes = Answer.YES;
  no = Answer.NO;
  maybe = Answer.MAYBE;

  constructor(private restService: RestService,
              private eventService: EventService) {
    this.event = this.eventService.currentEvent!;
  }

  ngOnInit(): void {
    console.log("event is", this.event)

  }

  addParticipant() {
    this.event.participants.push(new Participant("A"));
    this.restService.saveEvent(this.event); //TODO save in event.service on set
  }

  changeIsComing(participant: Participant, answer: Answer | undefined) {
    participant.answer = answer;
    this.restService.saveEvent(this.event); //TODO save in event.service on set
  }

}
