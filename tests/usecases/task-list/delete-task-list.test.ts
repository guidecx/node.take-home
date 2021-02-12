import faker from 'faker';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { InMemoryTaskListRepository } from '@/tests/fakeRepositories/inMemory-task-list-repository';
import { ServiceDeleteTaskList } from '@/usecases/implementations/task-list/delete-task-list';
import { DeleteTaskList } from '@/usecases/protocols';

type SutTypes = {
  sut: DeleteTaskList;
  taskListRepository: TaskListRepository;
};

const makeSut = (): SutTypes => {
  const taskListRepository = new InMemoryTaskListRepository();
  const sut = new ServiceDeleteTaskList(taskListRepository);
  return {
    sut,
    taskListRepository,
  };
};

describe('Delete a TaskList', () => {
  test('Should call TaskList findById with correct params', async () => {
    const { sut, taskListRepository } = makeSut();
    const fakeTaskList = await taskListRepository.create({
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    });

    const deleteTaskList = jest.spyOn(sut, 'delete');
    await sut.delete(fakeTaskList.id);
    expect(deleteTaskList).toHaveBeenCalledWith(fakeTaskList.id);
  });

  test('Should return false if task list does not exists', async () => {
    const { sut } = makeSut();

    const deleteTaskList = await sut.delete(11111);

    expect(deleteTaskList).toBeFalsy();
  });

  test('Should return true on success', async () => {
    const { sut, taskListRepository } = makeSut();
    const fakeTaskList = await taskListRepository.create({
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    });

    const deleteTaskList = await sut.delete(fakeTaskList.id);

    expect(deleteTaskList).toBeTruthy();
  });
});
