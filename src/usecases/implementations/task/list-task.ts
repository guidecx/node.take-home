import { TaskRepository } from '@/repositories/protocols/task-repository';
import { ListTask } from '@/usecases/protocols';

export class ServiceListTask implements ListTask {
  constructor(private taskRepository: TaskRepository) {}

  async list(): ListTask.Result {
    const listTask = await this.taskRepository.list();

    return listTask;
  }
}
