import { TaskListModel } from '@/models/task-list';

export interface CreateTaskList {
  create: (taskList: CreateTaskList.Params) => CreateTaskList.Result;
}

export namespace CreateTaskList {
  export type Params = {
    name: string;
    due_date: Date;
  };

  export type Result = Promise<TaskListModel>;
}
