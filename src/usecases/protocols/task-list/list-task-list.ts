import { TaskList } from '~/models/task-list';

export interface ListTaskList {
  list: () => Promise<ListTaskList.Result>;
}

export namespace ListTaskList {
  export type Result = TaskList[];
}
