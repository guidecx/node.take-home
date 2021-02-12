import faker from 'faker';
import { TaskRepository } from '@/repositories/protocols/task-repository';
import { InMemoryTaskListRepository } from '@/tests/fakeRepositories/inMemory-task-list-repository';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { InMemoryTaskRepository } from '@/tests/fakeRepositories/inMemory-task-repository';
import { ServiceListTask } from '@/usecases/implementations/task/list-task';
import { CreateTask, ListTask } from '@/usecases/protocols';

type SutTypes = {
  sut: ListTask;
  taskRepository: TaskRepository;
  taskListRepository: TaskListRepository;
};

const makeSut = (): SutTypes => {
  const taskRepository = new InMemoryTaskRepository();
  const taskListRepository = new InMemoryTaskListRepository();
  const sut = new ServiceListTask(taskRepository);
  return {
    sut,
    taskRepository,
    taskListRepository,
  };
};

describe('List all Tasks', () => {
  test('Should return undefined if do not has a Task', async () => {
    const { sut } = makeSut();

    const taskLists = await sut.list();

    expect(taskLists).toBeFalsy();
  });

  test('Should return an array of TaskLists on success', async () => {
    const { sut, taskListRepository, taskRepository } = makeSut();

    const requestTaskList = {
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const taskList = await taskListRepository.create(requestTaskList);

    const request: CreateTask.Params = {
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: taskList.id,
    };
    const task = await await taskRepository.create(request);

    const tasks = await sut.list();

    expect(tasks).toBeTruthy();
    if (tasks) {
      expect(tasks[0]).toBe(task);
    }
  });
});
