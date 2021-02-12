import { TaskRepository } from '@/repositories/protocols/task-repository';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { CreateTask } from '@/usecases/protocols';
import AppError from '@/util/errors/AppError';

export class ServiceCreateTask implements CreateTask {
  constructor(
    private taskRepository: TaskRepository,
    private taskListRepository: TaskListRepository,
  ) {}

  async create(task: CreateTask.Params): CreateTask.Result {
    const taskList = await this.taskListRepository.findById(task.task_list_id);

    if (!taskList) {
      throw new AppError('Task List not found');
    }

    if (task.dependency_id) {
      const taskDependency = await this.taskRepository.findById(
        task.dependency_id,
      );

      if (!taskDependency) {
        throw new AppError('Task Dependency not found');
      }
    }

    if (!task.name) {
      throw new AppError('Task name cannot be empty');
    }

    const result = await this.taskRepository.create(task);
    return result;
  }
}
