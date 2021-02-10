import { TaskListRepository } from '~/repositories/protocols/task-list-repository';
import { CreateTaskList } from '~/usecases/protocols';

export class ServiceCreateTaskList implements CreateTaskList {
  constructor(private taskListRepository: TaskListRepository) {}
  async create(taskList: CreateTaskList.Params): CreateTaskList.Result {
    const result = await this.taskListRepository.create(taskList);
    return result;
  }
}
