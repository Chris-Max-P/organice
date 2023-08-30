import {Injectable} from "@angular/core";
import {Event} from "../../modules/event-organizer/models/event.model";
import {RestService} from "@shared/services/rest.service";
import {Answer} from "../../modules/event-organizer/models/answer.enum";

@Injectable({providedIn: 'root' })
export class EventService {

  currentEvent: Event | undefined;
  events: Event[] = [];

  constructor(private restService: RestService) {
    this.restService.getEvents([]).subscribe((events: Event[]) => {
      console.log("read events", events);
      this.events = events;
    });
  }

  getYes(event: Event) {
    if (!event) return 0;
    return event.participants.filter(p => p.answer === Answer.YES).length;
  }

  getNo(event: Event) {
    if (!event) return 0;
    return event.participants.filter(p => p.answer === Answer.NO).length;
  }

  getMaybe(event: Event) {
    if (!event) return 0;
    return event.participants.filter(p => p.answer === Answer.MAYBE).length;
  }

  getNoAnswer(event: Event) {
    if (!event) return 0;
    return event.participants.filter(p => p.answer === undefined).length;
  }

}
