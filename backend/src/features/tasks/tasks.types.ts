// Tasks API types — see docs/specs/spec-backend.md, section 11

export interface Task {
  id: number;
  title: string;
  description: string;
}

export interface NewTask {
  title: string;
  description: string;
}
