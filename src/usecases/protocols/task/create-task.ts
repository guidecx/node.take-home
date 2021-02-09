import { Task } from '~/models/task';

export interface CreateTask {
  create: (task: CreateTask.Params) => Promise<CreateTask.Result>;
}

export namespace CreateTask {
  export type Params = {
    name: string;
    duration: number;
    task_list_id: number;
  };

  export type Result = Task;
}
