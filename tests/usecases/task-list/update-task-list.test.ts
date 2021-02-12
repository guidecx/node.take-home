import faker from 'faker';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { InMemoryTaskListRepository } from '@/tests/fakeRepositories/inMemory-task-list-repository';
import { ServiceUpdateTaskList } from '@/usecases/implementations/task-list/update-task-list';
import { UpdateTaskList } from '@/usecases/protocols';
import AppError from '@/util/errors/AppError';

type SutTypes = {
  sut: UpdateTaskList;
  taskListRepository: TaskListRepository;
};

const makeSut = (): SutTypes => {
  const taskListRepository = new InMemoryTaskListRepository();
  const sut = new ServiceUpdateTaskList(taskListRepository);
  return {
    sut,
    taskListRepository,
  };
};

describe('Update a TaskList', () => {
  test('Should call TaskList findById with correct params', async () => {
    const { sut, taskListRepository } = makeSut();
    const fakeTaskList = await taskListRepository.create({
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    });

    const request = {
      id: fakeTaskList.id,
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };

    const repositoryFindById = jest.spyOn(sut, 'update');
    await sut.update(request);
    expect(repositoryFindById).toHaveBeenCalledWith(request);
  });

  test('Should return an AppError if task does not exists', async () => {
    const { sut } = makeSut();

    const request = {
      id: 1111,
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const taskList = sut.update(request);

    expect(taskList).rejects.toBeInstanceOf(AppError);
  });

  test('Should return an TaskList on success', async () => {
    const { sut, taskListRepository } = makeSut();
    const fakeTaskList = await taskListRepository.create({
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    });

    const request = {
      id: fakeTaskList.id,
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const taskList = await sut.update(request);

    expect(taskList.name).toBe(request.name);
  });
});
