import {Answer} from "./answer.enum";

export class Participant {
  mail: string | undefined;
  answer: Answer | undefined;

  constructor(public name: string) {
  }
}
