import { TaskList } from '~/models/task-list';

export interface UpdateTaskList {
  update: (taskList: UpdateTaskList.Params) => Promise<UpdateTaskList.Result>;
}

export namespace UpdateTaskList {
  export type Params = {
    id: number;
    name: string;
  };

  export type Result = TaskList;
}
