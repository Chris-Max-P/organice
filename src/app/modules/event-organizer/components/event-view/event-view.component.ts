import {Component, Input, OnInit} from '@angular/core';
import {Event} from "../../models/event.model";
import {Participant} from "../../models/participant.model";
import {HttpClient} from "@angular/common/http";
import {Answer} from "../../models/answer.enum";

@Component({
  selector: 'event-view[event]',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit {

  @Input() event!: Event;
  yes = Answer.YES;
  no = Answer.NO;
  maybe = Answer.MAYBE;

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
  }

  addParticipant() {
    this.event.participants.push(new Participant("A"));
  }

  changeIsComing(participant: Participant, answer: Answer | undefined) {
    participant.answer = answer;
  }

}
