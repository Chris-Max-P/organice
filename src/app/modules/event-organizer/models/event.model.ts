import {Participant} from "./participant.model";
import {Answer} from "./answer.enum";

export class Event {

  constructor(public name: string,
              public participants: Participant[]) {
  }


}
