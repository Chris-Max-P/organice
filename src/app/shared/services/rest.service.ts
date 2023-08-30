import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {RestRequestEnum} from "@shared/models/RestRequest.enum";
import {Event} from "../../modules/event-organizer/models/event.model";//TODO project structure + model dir

@Injectable({providedIn: 'root' })
export class RestService {

  url = '/mongodb';

  constructor(private http: HttpClient) {
  }

  saveEvent(event: Event) {
    let body = {
      event: event,
      action: RestRequestEnum.SAVE
    }
    this.http.post(this.url, body).subscribe();
  }

  getEvents(eventIds: number[]) {
    let body = {
      eventIds: eventIds,
      action: RestRequestEnum.READ
    }
    return this.http.get<Event[]>(this.url);
  }

}
