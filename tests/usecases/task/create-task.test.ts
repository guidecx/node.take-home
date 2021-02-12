import faker from 'faker';
import { TaskRepository } from '@/repositories/protocols/task-repository';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { InMemoryTaskListRepository } from '@/tests/fakeRepositories/inMemory-task-list-repository';
import { InMemoryTaskRepository } from '@/tests/fakeRepositories/inMemory-task-repository';
import { ServiceCreateTask } from '@/usecases/implementations/task/create-task';
import { CreateTask } from '@/usecases/protocols';
import AppError from '@/util/errors/AppError';

type SutTypes = {
  sut: CreateTask;
  taskRepository: TaskRepository;
  taskListRepository: TaskListRepository;
};

const makeSut = (): SutTypes => {
  const taskRepository = new InMemoryTaskRepository();
  const taskListRepository = new InMemoryTaskListRepository();
  const sut = new ServiceCreateTask(taskRepository, taskListRepository);
  return {
    sut,
    taskRepository,
    taskListRepository,
  };
};

describe('Create a new Task', () => {
  test('Should call CreateTask with correct params', async () => {
    const { sut, taskRepository, taskListRepository } = makeSut();
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

    const repositoryCreate = jest.spyOn(taskRepository, 'create');
    await sut.create(request);
    expect(repositoryCreate).toHaveBeenCalledWith(request);
  });

  test('Should return an Task on success', async () => {
    const { sut, taskListRepository } = makeSut();

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
    const task = await sut.create(request);

    expect(task).toHaveProperty('id');
  });

  test('Should return an AppError if TaskList does not exists', async () => {
    const { sut } = makeSut();

    const request: CreateTask.Params = {
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: 0,
    };
    const task = sut.create(request);

    expect(task).rejects.toBeInstanceOf(AppError);
  });

  test('Should return an AppError if Task Dependency does not exists', async () => {
    const { sut, taskListRepository } = makeSut();

    const requestTaskList = {
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const taskList = await taskListRepository.create(requestTaskList);

    const request: CreateTask.Params = {
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: taskList.id,
      dependency_id: 1111,
    };

    await expect(sut.create(request)).rejects.toBeInstanceOf(AppError);
  });

  test('Should return an AppError if name param is empty', async () => {
    const { sut, taskListRepository } = makeSut();

    const requestTaskList = {
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const taskList = await taskListRepository.create(requestTaskList);

    const request: CreateTask.Params = {
      name: '',
      duration: 3,
      task_list_id: taskList.id,
    };
    const task = sut.create(request);

    expect(task).rejects.toBeInstanceOf(AppError);
  });
});
