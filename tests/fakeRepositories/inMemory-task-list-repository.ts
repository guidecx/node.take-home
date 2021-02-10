import { TaskList } from '~/models/task-list';
import { TaskListRepository } from '~/repositories/protocols/task-list-repository';
import { CreateTaskList } from '~/usecases/protocols';

export class InMemoryTaskListRepository implements TaskListRepository {
  private taskList: TaskList[];

  constructor() {
    this.taskList = [];
  }

  public async list(): Promise<TaskList[]> {
    if (this.taskList.length > 0) {
      return this.taskList;
    }
    return undefined;
  }
  public async create(data: CreateTaskList.Params): Promise<TaskList> {
    const newItem: TaskList = {
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

  public async findById(id: number): Promise<TaskList | undefined> {
    const findTaskList = this.taskList.find((taskList) => taskList.id === id);

    return findTaskList;
  }

  public async save(data: TaskList): Promise<TaskList> {
    const findIndex = this.taskList.findIndex(
      (taskList) => taskList.id === data.id,
    );

    this.taskList[findIndex] = data;

    return data;
  }

  public async delete(id: number): Promise<boolean> {
    const findIndex = this.taskList.findIndex((taskList) => taskList.id === id);

    if (findIndex > -1) {
      this.taskList.splice(findIndex, 1);
      return true;
    }

    return false;
  }
}

export default InMemoryTaskListRepository;
