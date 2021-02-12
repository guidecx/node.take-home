import { TaskListModel } from '@/models/task-list';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { CreateTaskList } from '@/usecases/protocols';

export class InMemoryTaskListRepository implements TaskListRepository {
  private taskList: TaskListModel[];

  constructor() {
    this.taskList = [];
  }

  public async list(): Promise<TaskListModel[] | undefined> {
    if (this.taskList.length > 0) {
      return this.taskList;
    }
    return undefined;
  }

  public async create(data: CreateTaskList.Params): Promise<TaskListModel> {
    const newItem: TaskListModel = {
      id: this.taskList.length + 1,
      name: data.name,
      started_at: null,
      due_date: data.due_date,
      forecasted_completion_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.taskList.push(newItem);

    return newItem;
  }

  public async findById(id: number): Promise<TaskListModel | undefined> {
    const findTaskList = this.taskList.find(taskList => taskList.id === id);

    return findTaskList;
  }

  public async save(data: TaskListModel): Promise<TaskListModel> {
    const findIndex = this.taskList.findIndex(
      taskList => taskList.id === data.id,
    );

    this.taskList[findIndex] = data;

    return data;
  }

  public async delete(id: number): Promise<boolean> {
    const findIndex = this.taskList.findIndex(taskList => taskList.id === id);

    if (findIndex > -1) {
      this.taskList.splice(findIndex, 1);
      return true;
    }

    return false;
  }

  public async updateForecastDate(id: number, date: Date): Promise<boolean> {
    const findTaskList = this.taskList.find(taskList => taskList.id === id);
    if (findTaskList) {
      findTaskList.forecasted_completion_date = date;
      return true;
    }

    return false;
  }
}

export default InMemoryTaskListRepository;
