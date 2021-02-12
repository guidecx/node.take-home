import { TaskModel } from '@/models/task';

export interface UpdateTask {
  update: (task: UpdateTask.Params) => UpdateTask.Result;
}

export namespace UpdateTask {
  export type Params = {
    id: number;
    name: string;
    duration: number;
  };

  export type Result = Promise<TaskModel>;
}
