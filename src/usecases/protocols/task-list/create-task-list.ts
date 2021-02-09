import { TaskList } from '~/models/task-list';

export interface CreateTaskList {
  create: (taskList: CreateTaskList.Params) => CreateTaskList.Result;
}

export namespace CreateTaskList {
  export type Params = {
    name: string;
  };

  export type Result = Promise<TaskList>;
}
