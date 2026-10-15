// Tasks API types — see docs/design/tasks.md, "Core-team task page (first slice)"

export interface Task {
  id: number;
  title: string;
  description: string;
}

export interface NewTask {
  title: string;
  description: string;
}
