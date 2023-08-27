import {Participant} from "./participant.model";

export class EventModel {

  constructor(public name: string,
              public participants: Participant[]) {
  }

  getYes() {
    return this.participants.filter(p => p.isComing).length;
  }

  getNo() {
    return this.participants.filter(p => p.isComing == false).length;
  }

  getMaybe() {
    return this.participants.filter(p => p.isComing == undefined).length;
  }
}
