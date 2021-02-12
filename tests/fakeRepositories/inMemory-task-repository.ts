import { addDays } from 'date-fns';
import { StatusRole, TaskModel } from '@/models/task';
import { TaskRepository } from '@/repositories/protocols/task-repository';
import { CreateTask } from '@/usecases/protocols';

export class InMemoryTaskRepository implements TaskRepository {
  private task: TaskModel[];

  constructor() {
    this.task = [];
  }

  public async list(): Promise<TaskModel[] | undefined> {
    if (this.task.length > 0) {
      return this.task;
    }
    return undefined;
  }

  public async create(data: CreateTask.Params): Promise<TaskModel> {
    const newItem: TaskModel = {
      id: this.task.length + 1,
      name: data.name,
      status: StatusRole.not_started,
      duration: data.duration,
      started_at: undefined,
      due_date: new Date(),
      dependency_id: data.dependency_id,
      task_list_id: data.task_list_id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.task.push(newItem);

    return newItem;
  }

  public async findById(id: number): Promise<TaskModel | undefined> {
    const findTask = this.task.find(task => task.id === id);

    return findTask;
  }

  public async save(data: TaskModel): Promise<TaskModel> {
    const findIndex = this.task.findIndex(task => task.id === data.id);

    this.task[findIndex] = data;

    return data;
  }

  public async delete(id: number): Promise<boolean> {
    const findIndex = this.task.findIndex(task => task.id === id);

    if (findIndex > -1) {
      this.task.splice(findIndex, 1);
      return true;
    }

    return false;
  }

  public async sumNewForecast(id: number): Promise<Date | boolean> {
    let duration = 0;
    let dateStarted = null;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.task.length; i++) {
      if (
        this.task[i].task_list_id === id &&
        (this.task[i].status === 'in_progress' ||
          this.task[i].status === 'not_started')
      ) {
        duration += this.task[i].duration;
      }

      if (
        this.task[i].task_list_id === id &&
        this.task[i].status === 'in_progress'
      ) {
        dateStarted = this.task[i].started_at;
      }
    }

    if (dateStarted) {
      return addDays(dateStarted, duration);
    }

    return false;
  }

  public async updateNextDependency(
    currentDependency: number | null | undefined,
    currentId: number,
  ): Promise<boolean> {
    const findTaskIndex = this.task.findIndex(task => task.id === currentId);
    const taskDependsCurrentIndex = this.task.findIndex(
      task => task.dependency_id === currentId,
    );

    this.task[findTaskIndex].dependency_id = null;

    if (taskDependsCurrentIndex > -1) {
      this.task[taskDependsCurrentIndex].dependency_id = currentDependency;

      if (this.task[findTaskIndex].status === StatusRole.in_progress) {
        this.task[taskDependsCurrentIndex].status = StatusRole.in_progress;
        this.task[taskDependsCurrentIndex].started_at = new Date();
      }
    }

    return true;
  }

  public async findByDependencyId(
    dependencyId: number,
  ): Promise<TaskModel | undefined> {
    const findTask = this.task.find(
      task => task.dependency_id === dependencyId,
    );

    return findTask;
  }
}

export default InMemoryTaskRepository;
