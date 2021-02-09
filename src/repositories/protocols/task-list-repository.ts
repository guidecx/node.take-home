import { TaskList } from '~/models/task-list';
import { CreateTaskList } from '~/usecases/protocols/task-list/create-task-list';

export interface TaskRepository {
  create: (data: CreateTaskList.Params) => Promise<TaskList>;
}
