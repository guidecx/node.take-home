import { TaskModel } from '@/models/task';
import { CreateTask } from '@/usecases/protocols';

export interface TaskRepository {
  findById: (id: number) => Promise<TaskModel | undefined>;
  sumNewForecast: (id: number) => Promise<Date | boolean>;
  list: () => Promise<TaskModel[] | undefined>;
  create: (data: CreateTask.Params) => Promise<TaskModel>;
  save: (data: TaskModel) => Promise<TaskModel>;
  delete: (id: number) => Promise<boolean>;
  updateNextDependency: (
    currentDependency: number | null | undefined,
    currentId: number,
  ) => Promise<boolean>;
  findByDependencyId: (dependencyId: number) => Promise<TaskModel | undefined>;
}
