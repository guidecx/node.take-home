import { TaskListModel } from '@/models/task-list';

export interface ListTaskList {
  list: () => ListTaskList.Result;
}

export namespace ListTaskList {
  export type Result = Promise<TaskListModel[] | undefined>;
}
