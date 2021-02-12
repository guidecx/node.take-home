import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { ListTaskList } from '@/usecases/protocols';

export class ServiceListTaskList implements ListTaskList {
  constructor(private taskListRepository: TaskListRepository) {}

  async list(): ListTaskList.Result {
    const listTaskLists = await this.taskListRepository.list();

    return listTaskLists;
  }
}
