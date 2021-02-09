import faker from 'faker';
import { TaskRepository } from '~/repositories/protocols/task-list-repository';
import { InMemoryTaskListRepository } from '../fakeRepositories/inMemory-task-list-repository';
import { ServiceCreateTaskList } from '~/usecases/implementations/task-list/create-task-list';
import { CreateTaskList } from './protocols';

const makeSut = (): SutTypes => {
  const taskRepository = new InMemoryTaskListRepository();
  const sut = new ServiceCreateTaskList(taskRepository);
  return {
    sut,
    taskRepository,
  };
};

type SutTypes = {
  sut: CreateTaskList;
  taskRepository: TaskRepository;
};

describe('Create a new TaskList', () => {
  test('Should call TaskList with correct params', async () => {
    const { sut, taskRepository } = makeSut();
    const request = {
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const repositoryCreate = jest.spyOn(taskRepository, 'create');
    await sut.create(request);
    expect(repositoryCreate).toHaveBeenCalledWith(request);
  });

  test('Should return an TaskList on success', async () => {
    const { sut } = makeSut();
    const request = {
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const taskList = await sut.create(request);

    expect(taskList).toHaveProperty('id');
  });
});
