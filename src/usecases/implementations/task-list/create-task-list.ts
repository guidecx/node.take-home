import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { CreateTaskList } from '@/usecases/protocols';

export class ServiceCreateTaskList implements CreateTaskList {
  constructor(private taskRepository: TaskListRepository) {}

  async create(taskList: CreateTaskList.Params): CreateTaskList.Result {
    const result = await this.taskRepository.create(taskList);
    return result;
  }
}
