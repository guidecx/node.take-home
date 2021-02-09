import { TaskRepository } from '~/repositories/protocols/task-list-repository';
import { DeleteTaskList } from '~/usecases/protocols';

export class ServiceDeleteTaskList implements DeleteTaskList {
  constructor(private taskRepository: TaskRepository) {}
  async delete(id: number): DeleteTaskList.Result {
    const result = await this.taskRepository.delete(id);

    return result;
  }
}
