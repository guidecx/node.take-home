import faker from 'faker';
import { TaskRepository } from '@/repositories/protocols/task-repository';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { InMemoryTaskListRepository } from '@/tests/fakeRepositories/inMemory-task-list-repository';
import { InMemoryTaskRepository } from '@/tests/fakeRepositories/inMemory-task-repository';
import { ServiceDeleteTask } from '@/usecases/implementations/task/delete-task';
import { DeleteTask } from '@/usecases/protocols';
import AppError from '@/util/errors/AppError';
import { StatusRole } from '@/models/task';

type SutTypes = {
  sut: DeleteTask;
  taskRepository: TaskRepository;
  taskListRepository: TaskListRepository;
};

const makeSut = (): SutTypes => {
  const taskRepository = new InMemoryTaskRepository();
  const taskListRepository = new InMemoryTaskListRepository();
  const sut = new ServiceDeleteTask(taskRepository, taskListRepository);
  return {
    sut,
    taskRepository,
    taskListRepository,
  };
};

describe('Delete a Task', () => {
  test('Should call CreateTask with correct params', async () => {
    const { sut, taskRepository, taskListRepository } = makeSut();
    const requestTaskList = {
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const taskList = await taskListRepository.create(requestTaskList);

    const taskParams = {
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: taskList.id,
    };

    const task = await taskRepository.create(taskParams);

    const repositoryCreate = jest.spyOn(sut, 'delete');
    await sut.delete(task.id);
    expect(repositoryCreate).toHaveBeenCalledWith(task.id);
  });

  test('Should return true when delete Task on success', async () => {
    const { sut, taskRepository, taskListRepository } = makeSut();
    const requestTaskList = {
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const taskList = await taskListRepository.create(requestTaskList);

    const taskParams = {
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: taskList.id,
    };

    const task = await taskRepository.create(taskParams);

    const deleteTask = await sut.delete(task.id);

    expect(deleteTask).toBeTruthy();
  });

  test('Should return an AppError if Task does not exists', async () => {
    const { sut } = makeSut();

    const task = sut.delete(1111);

    expect(task).rejects.toBeInstanceOf(AppError);
  });

  test('Should return an AppError if Task is already completed', async () => {
    const taskRepository = new InMemoryTaskRepository();
    const taskListRepository = new InMemoryTaskListRepository();
    const sut = new ServiceDeleteTask(taskRepository, taskListRepository);

    jest.spyOn(taskRepository, 'findById').mockResolvedValue({
      id: 1,
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: 1,
      status: StatusRole.complete,
      created_at: faker.date.past(),
      updated_at: faker.date.past(),
    });

    const result = sut.delete(1);

    expect(result).rejects.toBeInstanceOf(AppError);
  });

  test('Should update forecast from task list if change duration', async () => {
    const taskRepository = new InMemoryTaskRepository();
    const taskListRepository = new InMemoryTaskListRepository();
    const sut = new ServiceDeleteTask(taskRepository, taskListRepository);

    const requestTaskList = {
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const taskList = await taskListRepository.create(requestTaskList);

    const taskParams = {
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: taskList.id,
    };

    await taskRepository.create(taskParams);

    const taskParams2 = {
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: taskList.id,
    };

    const task = await taskRepository.create(taskParams2);

    const fakeForecast = faker.date.soon();

    jest
      .spyOn(taskRepository, 'sumNewForecast')
      .mockResolvedValue(fakeForecast);

    await sut.delete(task.id);

    const taskUpdated = await taskListRepository.findById(taskList.id);

    expect(taskUpdated?.forecasted_completion_date).toBe(fakeForecast);
  });

  test('Should return appError if updateNextDependency returns false', async () => {
    const { sut, taskRepository, taskListRepository } = makeSut();
    const requestTaskList = {
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const taskList = await taskListRepository.create(requestTaskList);

    const taskParams = {
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: taskList.id,
    };

    const task = await taskRepository.create(taskParams);

    jest.spyOn(taskRepository, 'updateNextDependency').mockResolvedValue(false);

    const deleteTask = sut.delete(task.id);

    expect(deleteTask).rejects.toBeInstanceOf(AppError);
  });

  test('Should return appError if repository delete returns false', async () => {
    const { sut, taskRepository, taskListRepository } = makeSut();
    const requestTaskList = {
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    };
    const taskList = await taskListRepository.create(requestTaskList);

    const taskParams = {
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: taskList.id,
    };

    const task = await taskRepository.create(taskParams);

    jest.spyOn(taskRepository, 'delete').mockResolvedValue(false);

    const deleteTask = sut.delete(task.id);

    expect(deleteTask).rejects.toBeInstanceOf(AppError);
  });
});
