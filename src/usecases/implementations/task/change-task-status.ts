import { StatusRole } from '@/models/task';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { TaskRepository } from '@/repositories/protocols/task-repository';
import { ChangeTaskStatus } from '@/usecases/protocols';
import AppError from '@/util/errors/AppError';
import { addDays } from 'date-fns';

export class ServiceChangeTaskStatus implements ChangeTaskStatus {
  constructor(
    private taskRepository: TaskRepository,
    private taskListRepository: TaskListRepository,
  ) {}

  async changeStatus(params: ChangeTaskStatus.Params): ChangeTaskStatus.Result {
    const task = await this.taskRepository.findById(params.id);
    if (!task) {
      throw new AppError('Task List not found');
    }

    if (task.status === 'complete') {
      throw new AppError('Task already completed cannot be edited');
    }

    if (params.status === task.status) {
      return true;
    }

    if (task.dependency_id) {
      const verifyDependency = await this.taskRepository.findById(
        task.dependency_id,
      );
      if (verifyDependency?.status !== 'complete') {
        throw new AppError(
          'Task cannot be modified without ending dependency ',
        );
      }
    }

    if (params.status === 'in_progress') {
      task.status = params.status;
      task.started_at = new Date();
      task.due_date = addDays(new Date(), task.duration);
      await this.taskRepository.save(task);
    }

    if (params.status === 'complete') {
      task.status = params.status;
      if (!task.started_at) {
        task.started_at = new Date();
        task.due_date = addDays(new Date(), task.duration);
      }
      await this.taskRepository.save(task);

      const nextTask = await this.taskRepository.findByDependencyId(task.id);

      if (nextTask) {
        nextTask.status = StatusRole.in_progress;
        nextTask.started_at = new Date();
        nextTask.due_date = addDays(new Date(), task.duration);
        await this.taskRepository.save(nextTask);
      }
    }

    const forecastDays = await this.taskRepository.sumNewForecast(
      task.task_list_id,
    );

    if (forecastDays instanceof Date) {
      this.taskListRepository.updateForecastDate(
        task.task_list_id,
        forecastDays,
      );
    }

    return true;
  }
}
