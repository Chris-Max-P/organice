import {Component, Input, OnInit} from '@angular/core';
import {EventModel} from "../../models/event.model";
import {Participant} from "../../models/participant.model";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'event-view[event]',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit {

  @Input() event!: EventModel;
  isComing: boolean = true;
  text: string | undefined;

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
  }

  addInput() {
    let participantName = (<HTMLInputElement>(document.getElementById("add"))!).value;
    let participant = new Participant(participantName);
    participant.isComing = this.isComing;
    this.event.participants.push(participant);
    this.resetInput();
  }

  resetInput() {
    (<HTMLInputElement>(document.getElementById("add"))!).value = '';
  }

  sendMail() {
    let body = {text: this.text};
    this.http.post('http://localhost:8081/send-mail', body).subscribe((response) => {
      console.log(response);
    })
  }

}
