import { addDays } from 'date-fns';
import { Task } from '~/models/task';
import { TaskRepository } from '~/repositories/protocols/task-repository';
import { CreateTask } from '~/usecases/protocols';
import client from '~/db/client';

export class DbTaskRepository implements TaskRepository {
  task: any;
  constructor() {
    this.task = client<Task>('task_lists');
  }

  public async list(): Promise<Task[]> {
    const lists = await this.task.select(
      'id',
      'name',
      'status',
      'duration',
      'started_at',
      'due_date',
      'created_at',
      'updated_at',
      'dependency_id',
      'task_list_id',
    );

    return lists;
  }
  public async create(data: CreateTask.Params): Promise<Task> {
    const [lastId] = await this.task.insert(data, 'id');
    const findById = await this.task.where('id', lastId).first();

    return findById;
  }

  public async findById(id: number): Promise<Task | undefined> {
    const findById = await this.task.where('id', id).first();

    return findById;
  }

  public async save(data: Task): Promise<Task> {
    const { id, ...rest } = data;

    await this.task.where({ id }).update(rest);

    return data;
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await this.task.where('id', id).del();

    return Boolean(deleted);
  }

  public async sumNewForecast(id: number): Promise<Date | boolean> {
    let duration = 0;
    let dateStarted = null;

    duration = await this.task
      .sum('duration')
      .where({
        task_list_id: id,
        status: 'in_progress',
      })
      .orWhere({
        task_list_id: id,
        status: 'not_started',
      });

    dateStarted = await this.task.select('started_at').where({
      task_list_id: id,
      status: 'in_progress',
    });

    if (dateStarted) {
      return addDays(dateStarted, duration);
    }

    return false;
  }

  public async updateNextDependency(
    currentDependency: number,
    currentId: number,
  ): Promise<boolean> {
    await this.task.where({ id: currentId }).update({ dependency_id: null });

    await this.task.where({ dependency_id: currentId }).update({
      dependency_id: currentDependency,
      status: 'in_progress',
      started_at: new Date(),
    });

    return true;
  }
  public async findByDependencyId(
    dependencyId: number,
  ): Promise<Task | undefined> {
    const findTask = await this.task
      .where('dependency_id', dependencyId)
      .first();

    return findTask;
  }
}

export default DbTaskRepository;
