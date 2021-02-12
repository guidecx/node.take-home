import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { DeleteTaskList } from '@/usecases/protocols';

export class ServiceDeleteTaskList implements DeleteTaskList {
  constructor(private taskListRepository: TaskListRepository) {}

  async delete(id: number): DeleteTaskList.Result {
    const result = await this.taskListRepository.delete(id);

    return result;
  }
}
