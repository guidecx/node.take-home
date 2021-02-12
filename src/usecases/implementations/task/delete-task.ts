import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { TaskRepository } from '@/repositories/protocols/task-repository';
import { DeleteTask } from '@/usecases/protocols';
import AppError from '@/util/errors/AppError';

export class ServiceDeleteTask implements DeleteTask {
  constructor(
    private taskRepository: TaskRepository,
    private taskListRepository: TaskListRepository,
  ) {}

  async delete(id: number): DeleteTask.Result {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new AppError('Task not found');
    }

    if (task.status === 'complete') {
      throw new AppError('Task already completed cannot be deleted');
    }

    // busca quem depende de mim e atualiza para minha dependencia
    const updateDependency = await this.taskRepository.updateNextDependency(
      task.dependency_id,
      task.id,
    );

    if (!updateDependency) {
      throw new AppError('Error delete task');
    }

    const deleteTask = await this.taskRepository.delete(task.id);

    if (!deleteTask) {
      throw new AppError('Error delete task');
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
