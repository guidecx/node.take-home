import { TaskList } from '~/models/task-list';
import { CreateTaskList } from '~/usecases/protocols';

export interface TaskRepository {
  findById: (id: number) => Promise<TaskList | undefined>;
  create: (data: CreateTaskList.Params) => Promise<TaskList>;
  save: (data: TaskList) => Promise<TaskList>;
  delete: (id: number) => Promise<boolean>;
}
