import { TaskListModel } from '@/models/task-list';

export interface UpdateTaskList {
  update: (taskList: UpdateTaskList.Params) => UpdateTaskList.Result;
}

export namespace UpdateTaskList {
  export type Params = {
    id: number;
    name: string;
    due_date: Date;
  };

  export type Result = Promise<TaskListModel>;
}
