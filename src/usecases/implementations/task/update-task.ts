import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { TaskRepository } from '@/repositories/protocols/task-repository';
import { UpdateTask } from '@/usecases/protocols';
import AppError from '@/util/errors/AppError';

export class ServiceUpdateTask implements UpdateTask {
  constructor(
    private taskRepository: TaskRepository,
    private taskListRepository: TaskListRepository,
  ) {}

  async update(params: UpdateTask.Params): UpdateTask.Result {
    const task = await this.taskRepository.findById(params.id);
    if (!task) {
      throw new AppError('Task List not found');
    }

    if (task.status === 'complete') {
      throw new AppError('Task already completed cannot be edited');
    }

    const oldDuration = task.duration;

    task.name = params.name;
    task.duration = params.duration;

    const result = await this.taskRepository.save(task);

    if (oldDuration !== params.duration) {
      const forecastDays = await this.taskRepository.sumNewForecast(
        task.task_list_id,
      );

      if (forecastDays instanceof Date) {
        this.taskListRepository.updateForecastDate(
          task.task_list_id,
          forecastDays,
        );
      }
    }

    return result;
  }
}
