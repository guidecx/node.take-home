import faker from 'faker';
import { TaskRepository } from '@/repositories/protocols/task-repository';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { InMemoryTaskListRepository } from '@/tests/fakeRepositories/inMemory-task-list-repository';
import { InMemoryTaskRepository } from '@/tests/fakeRepositories/inMemory-task-repository';
import { ServiceUpdateTask } from '@/usecases/implementations/task/update-task';
import { UpdateTask } from '@/usecases/protocols';
import AppError from '@/util/errors/AppError';
import { StatusRole } from '@/models/task';

type SutTypes = {
  sut: UpdateTask;
  taskRepository: TaskRepository;
  taskListRepository: TaskListRepository;
};

const makeSut = (): SutTypes => {
  const taskRepository = new InMemoryTaskRepository();
  const taskListRepository = new InMemoryTaskListRepository();
  const sut = new ServiceUpdateTask(taskRepository, taskListRepository);
  return {
    sut,
    taskRepository,
    taskListRepository,
  };
};

describe('Update a Task', () => {
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

    const request = {
      id: task.id,
      name: faker.vehicle.model(),
      duration: 3,
    };

    const repositoryCreate = jest.spyOn(sut, 'update');
    await sut.update(request);
    expect(repositoryCreate).toHaveBeenCalledWith(request);
  });

  test('Should return an updated Task on success', async () => {
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

    const request = {
      id: task.id,
      name: faker.vehicle.model(),
      duration: 3,
    };

    const updated = await sut.update(request);

    expect(updated.name).toBe(request.name);
  });

  test('Should return an AppError if Task does not exists', async () => {
    const { sut } = makeSut();

    const request = {
      id: 1,
      name: faker.vehicle.model(),
      duration: 3,
    };
    const task = sut.update(request);

    expect(task).rejects.toBeInstanceOf(AppError);
  });

  test('Should return an AppError if Task is already completed', async () => {
    const taskRepository = new InMemoryTaskRepository();
    const taskListRepository = new InMemoryTaskListRepository();
    const sut = new ServiceUpdateTask(taskRepository, taskListRepository);

    jest.spyOn(taskRepository, 'findById').mockResolvedValue({
      id: 1,
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: 1,
      status: StatusRole.complete,
      created_at: faker.date.past(),
      updated_at: faker.date.past(),
    });

    const request = {
      id: 1,
      name: faker.vehicle.model(),
      duration: 3,
    };

    const result = sut.update(request);

    expect(result).rejects.toBeInstanceOf(AppError);
  });

  test('Should update forecast from task list if change duration', async () => {
    const taskRepository = new InMemoryTaskRepository();
    const taskListRepository = new InMemoryTaskListRepository();
    const sut = new ServiceUpdateTask(taskRepository, taskListRepository);

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

    const request = {
      id: task.id,
      name: faker.vehicle.model(),
      duration: 5,
    };

    const fakeForecast = faker.date.soon();

    jest
      .spyOn(taskRepository, 'sumNewForecast')
      .mockResolvedValue(fakeForecast);

    await sut.update(request);

    const taskUpdated = await taskListRepository.findById(taskList.id);

    expect(taskUpdated?.forecasted_completion_date).toBe(fakeForecast);
  });
});
