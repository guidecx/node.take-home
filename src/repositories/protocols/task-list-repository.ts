import { TaskList } from '~/models/task-list';
import { CreateTaskList, UpdateTaskList } from '~/usecases/protocols';

export interface TaskRepository {
  findById: (id: number) => Promise<TaskList | undefined>;
  create: (data: CreateTaskList.Params) => Promise<TaskList>;
  save: (data: TaskList) => Promise<TaskList>;
}
