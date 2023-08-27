import {Participant} from "./participant.model";
import {Answer} from "./answer.enum";

export class Event {

  constructor(public name: string,
              public participants: Participant[]) {
  }

  getYes() {
    return this.participants.filter(p => p.answer === Answer.YES).length;
  }

  getNo() {
    return this.participants.filter(p => p.answer === Answer.NO).length;
  }

  getMaybe() {
    return this.participants.filter(p => p.answer === Answer.MAYBE).length;
  }

  getNoAnswer() {
    return this.participants.filter(p => p.answer === undefined).length;
  }
}
