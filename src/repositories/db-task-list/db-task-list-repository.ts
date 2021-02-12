import { getRepository, Repository } from 'typeorm';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { CreateTaskList } from '@/usecases/protocols';
import { TaskListModel } from '@/models/task-list';
import TaskList from './entities/task-list';

class DbTaskListListRepository implements TaskListRepository {
  private ormRepository: Repository<TaskList>;

  constructor() {
    this.ormRepository = getRepository(TaskList);
  }

  public async list(): Promise<TaskListModel[]> {
    const lists = await this.ormRepository.find();

    return lists;
  }

  public async create(data: CreateTaskList.Params): Promise<TaskListModel> {
    const newTaskList = this.ormRepository.create(data);
    await this.ormRepository.save(newTaskList);

    return newTaskList;
  }

  public async findById(id: number): Promise<TaskListModel | undefined> {
    const findById = await this.ormRepository.findOne(id);

    return findById;
  }

  public async save(data: TaskListModel): Promise<TaskListModel> {
    await this.ormRepository.save(data);

    return data;
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await this.ormRepository.delete(id);

    return Boolean(deleted);
  }

  public async updateForecastDate(id: number, date: Date): Promise<boolean> {
    const updated = this.ormRepository.save({
      id,
      forecasted_completion_date: date,
    });

    return Boolean(updated);
  }
}

export default DbTaskListListRepository;
