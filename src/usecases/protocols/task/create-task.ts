import { TaskModel } from '@/models/task';

export interface CreateTask {
  create: (task: CreateTask.Params) => CreateTask.Result;
}

export namespace CreateTask {
  export type Params = {
    name: string;
    duration: number;
    task_list_id: number;
    dependency_id?: number;
  };

  export type Result = Promise<TaskModel>;
}
