import { TaskListModel } from '@/models/task-list';
import { CreateTaskList } from '@/usecases/protocols';

export interface TaskListRepository {
  findById: (id: number) => Promise<TaskListModel | undefined>;
  list: () => Promise<TaskListModel[] | undefined>;
  create: (data: CreateTaskList.Params) => Promise<TaskListModel>;
  save: (data: TaskListModel) => Promise<TaskListModel>;
  delete: (id: number) => Promise<boolean>;
  updateForecastDate: (id: number, date: Date) => Promise<boolean>;
}
