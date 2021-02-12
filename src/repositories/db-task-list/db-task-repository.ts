import { getRepository, Repository } from 'typeorm';
import { addDays, parseISO } from 'date-fns';
import { TaskRepository } from '@/repositories/protocols/task-repository';
import { CreateTask } from '@/usecases/protocols';
import { StatusRole, TaskModel } from '@/models/task';
import Task from './entities/task';

class DbTaskRepository implements TaskRepository {
  private ormRepository: Repository<Task>;

  constructor() {
    this.ormRepository = getRepository(Task);
  }

  public async list(): Promise<TaskModel[]> {
    const lists = await this.ormRepository.find();

    return lists;
  }

  public async create(data: CreateTask.Params): Promise<TaskModel> {
    const newTask = this.ormRepository.create(data);
    await this.ormRepository.save(newTask);

    return newTask;
  }

  public async findById(id: number): Promise<TaskModel | undefined> {
    const findById = await this.ormRepository.findOne(id);

    return findById;
  }

  public async save(data: TaskModel): Promise<TaskModel> {
    await this.ormRepository.save(data);

    return data;
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await this.ormRepository.delete(id);

    return Boolean(deleted);
  }

  public async sumNewForecast(id: number): Promise<Date | boolean> {
    const { sum: duration } = await this.ormRepository
      .createQueryBuilder()
      .select('SUM(Task.duration)', 'sum')
      .where(
        'Task.task_list_id = :task_list_id AND (Task.status = :statusProgress OR Task.status = :statusNot)',
        {
          task_list_id: id,
          statusProgress: 'in_progress',
          statusNot: 'not_started',
        },
      )
      .getRawOne();

    const dateStarted = await this.ormRepository.findOne({
      where: {
        task_list_id: id,
        status: 'in_progress',
      },
      select: ['started_at'],
    });

    if (dateStarted?.started_at) {
      return addDays(
        parseISO(String(dateStarted.started_at)),
        Number(duration),
      );
    }
    return false;
  }

  public async updateNextDependency(
    currentDependency: number | null | undefined,
    currentId: number,
  ): Promise<boolean> {
    await this.ormRepository.save({
      id: currentId,
      dependency_id: null,
    });

    await this.ormRepository.save({
      dependency_id: currentId,
      status: StatusRole.in_progress,
      started_at: new Date(),
    });

    return true;
  }

  public async findByDependencyId(
    dependencyId: number,
  ): Promise<Task | undefined> {
    const findTask = await this.ormRepository.findOne({
      where: {
        dependency_id: dependencyId,
      },
    });

    return findTask;
  }
}

export default DbTaskRepository;
