import { TaskRepository } from '~/repositories/protocols/task-list-repository';
import { UpdateTaskList } from '~/usecases/protocols';
import AppError from '~/util/errors/AppError';

export class ServiceUpdateTaskList implements UpdateTaskList {
  constructor(private taskRepository: TaskRepository) {}
  async update(taskList: UpdateTaskList.Params): UpdateTaskList.Result {
    const task = await this.taskRepository.findById(taskList.id);
    if (!task) {
      throw new AppError('Task List not found');
    }

    task.name = taskList.name;
    task.due_date = taskList.due_date;

    const result = await this.taskRepository.save(task);

    return result;
  }
}
