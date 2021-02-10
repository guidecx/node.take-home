import { Task } from '~/models/task';
import { CreateTask } from '~/usecases/protocols';

export interface TaskRepository {
  findById: (id: number) => Promise<Task | undefined>;
  sumNewForecast: (id: number) => Promise<Date | boolean>;
  list: () => Promise<Task[] | undefined>;
  create: (data: CreateTask.Params) => Promise<Task>;
  save: (data: Task) => Promise<Task>;
  delete: (id: number) => Promise<boolean>;
}
