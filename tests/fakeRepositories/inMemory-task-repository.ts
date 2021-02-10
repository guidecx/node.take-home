import { Task } from '~/models/task';
import { TaskRepository } from '~/repositories/protocols/task-repository';
import { CreateTask } from '~/usecases/protocols';

export class InMemoryTaskRepository implements TaskRepository {
  private task: Task[];

  constructor() {
    this.task = [];
  }

  public async list(): Promise<Task[]> {
    if (this.task.length > 0) {
      return this.task;
    }
    return undefined;
  }
  public async create(data: CreateTask.Params): Promise<Task> {
    const newItem: Task = {
      id: this.task.length + 1,
      name: data.name,
      status: 'not_started',
      duration: data.duration,
      started_at: null,
      due_date: new Date(),
      dependency_id: data.dependency_id,
      task_list_id: data.task_list_id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.task.push(newItem);

    return newItem;
  }

  public async findById(id: number): Promise<Task | undefined> {
    const findTask = this.task.find((task) => task.id === id);

    return findTask;
  }

  public async save(data: Task): Promise<Task> {
    const findIndex = this.task.findIndex((task) => task.id === data.id);

    this.task[findIndex] = data;

    return data;
  }

  public async delete(id: number): Promise<boolean> {
    const findIndex = this.task.findIndex((task) => task.id === id);

    if (findIndex > -1) {
      this.task.splice(findIndex, 1);
      return true;
    }

    return false;
  }
}

export default InMemoryTaskRepository;
