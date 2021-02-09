import { Task } from '~/models/task';

export interface ListTask {
  list: () => Promise<ListTask.Result>;
}

export namespace ListTask {
  export type Result = Task[];
}
