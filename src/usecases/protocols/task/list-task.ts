import { Task } from '~/models/task';

export interface ListTask {
  list: () => ListTask.Result;
}
export namespace ListTask {
  export type Result = Promise<Task[] | undefined>;
}
