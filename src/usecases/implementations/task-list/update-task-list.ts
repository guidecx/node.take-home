import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { UpdateTaskList } from '@/usecases/protocols';
import AppError from '@/util/errors/AppError';

export class ServiceUpdateTaskList implements UpdateTaskList {
  constructor(private taskListRepository: TaskListRepository) {}

  async update(taskList: UpdateTaskList.Params): UpdateTaskList.Result {
    const task = await this.taskListRepository.findById(taskList.id);
    if (!task) {
      throw new AppError('Task List not found');
    }

    task.name = taskList.name;
    task.due_date = taskList.due_date;

    const result = await this.taskListRepository.save(task);

    return result;
  }
}
