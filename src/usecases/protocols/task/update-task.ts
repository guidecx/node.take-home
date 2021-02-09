import { Task } from '~/models/task';

export interface UpdateTask {
  update: (task: UpdateTask.Params) => Promise<UpdateTask.Result>;
}

export namespace UpdateTask {
  export type Params = {
    id: number;
    name: string;
  };

  export type Result = Task;
}
