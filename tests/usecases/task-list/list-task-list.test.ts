import faker from 'faker';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { InMemoryTaskListRepository } from '@/tests/fakeRepositories/inMemory-task-list-repository';
import { ServiceListTaskList } from '@/usecases/implementations/task-list/list-task-list';
import { ListTaskList } from '@/usecases/protocols';

type SutTypes = {
  sut: ListTaskList;
  taskListRepository: TaskListRepository;
};

const makeSut = (): SutTypes => {
  const taskListRepository = new InMemoryTaskListRepository();
  const sut = new ServiceListTaskList(taskListRepository);
  return {
    sut,
    taskListRepository,
  };
};

describe('List all TaskLists', () => {
  test('Should return undefined if do not have a Task List', async () => {
    const { sut } = makeSut();

    const taskLists = await sut.list();

    expect(taskLists).toBeFalsy();
  });

  test('Should return an array of TaskLists on success', async () => {
    const { sut, taskListRepository } = makeSut();
    const fakeTaskList = await taskListRepository.create({
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    });

    const taskList = await sut.list();

    expect(taskList).toBeTruthy();

    if (taskList) {
      expect(taskList[0]).toBe(fakeTaskList);
    }
  });
});
