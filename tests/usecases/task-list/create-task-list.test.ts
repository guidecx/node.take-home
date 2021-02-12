import faker from 'faker';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { InMemoryTaskListRepository } from '@/tests/fakeRepositories/inMemory-task-list-repository';
import { ServiceCreateTaskList } from '@/usecases/implementations/task-list/create-task-list';
import { CreateTaskList } from '@/usecases/protocols';

type SutTypes = {
  sut: CreateTaskList;
  taskListRepository: TaskListRepository;
};

const makeSut = (): SutTypes => {
  const taskListRepository = new InMemoryTaskListRepository();
  const sut = new ServiceCreateTaskList(taskListRepository);
  return {
    sut,
    taskListRepository,
  };
};

describe('Create a new TaskList', () => {
  test('Should call TaskList with correct params', async () => {
    const { sut, taskListRepository } = makeSut();
    const request = {
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const repositoryCreate = jest.spyOn(taskListRepository, 'create');
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
