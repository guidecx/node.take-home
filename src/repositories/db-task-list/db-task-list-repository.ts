import { TaskList as TypeTaskList } from '~/models/task-list';
import { TaskListRepository } from '~/repositories/protocols/task-list-repository';
import { CreateTaskList } from '~/usecases/protocols';
import client from '~/db/client';

class DbTaskListRepository implements TaskListRepository {
  taskList: any;
  constructor() {
    this.taskList = client<TypeTaskList>('task_lists');
  }
  public async list(): Promise<TypeTaskList[]> {
    const lists = await this.taskList.select(
      'id',
      'created_at',
      'due_date',
      'forecasted_end_date',
      'name',
      'started_at',
      'updated_at',
    );

    return lists;
  }
  public async create(data: CreateTaskList.Params): Promise<TypeTaskList> {
    const [lastId] = await this.taskList.insert(data, 'id');
    const findById = await this.taskList.where('id', lastId).first();

    return findById;
  }

  public async findById(id: number): Promise<TypeTaskList | undefined> {
    const findById = await this.taskList.where('id', id).first();

    return findById;
  }

  public async save(data: TypeTaskList): Promise<TypeTaskList> {
    const { id, ...rest } = data;

    await this.taskList.where({ id }).update(rest);

    return data;
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await this.taskList.where('id', id).del();

    return Boolean(deleted);
  }

  public async updateForecastDate(id: number, date: Date): Promise<boolean> {
    const updated = await this.taskList.where({ id }).update({
      forecasted_completion_date: date,
    });

    return Boolean(updated);
  }
}

export default DbTaskListRepository;
