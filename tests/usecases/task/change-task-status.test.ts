import faker from 'faker';
import { TaskRepository } from '@/repositories/protocols/task-repository';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';
import { InMemoryTaskListRepository } from '@/tests/fakeRepositories/inMemory-task-list-repository';
import { InMemoryTaskRepository } from '@/tests/fakeRepositories/inMemory-task-repository';
import { ServiceChangeTaskStatus } from '@/usecases/implementations/task/change-task-status';
import { ChangeTaskStatus } from '@/usecases/protocols';
import AppError from '@/util/errors/AppError';
import { StatusRole } from '@/models/task';

type SutTypes = {
  sut: ChangeTaskStatus;
  taskRepository: TaskRepository;
  taskListRepository: TaskListRepository;
};

const makeSut = (): SutTypes => {
  const taskRepository = new InMemoryTaskRepository();
  const taskListRepository = new InMemoryTaskListRepository();
  const sut = new ServiceChangeTaskStatus(taskRepository, taskListRepository);
  return {
    sut,
    taskRepository,
    taskListRepository,
  };
};

describe('Change Task Status', () => {
  test('Should return true when change Task status on success', async () => {
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

    const changeStatusParams = {
      id: task.id,
      status: StatusRole.in_progress,
    };

    const changeStatusResult = await sut.changeStatus(changeStatusParams);

    const changedStatus = await taskRepository.findById(task.id);

    expect(changeStatusResult).toBeTruthy();
    expect(changedStatus?.status).toBe(StatusRole.in_progress);
  });

  test('Should return true when the new status is tha same previous', async () => {
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

    const changeStatusParams = {
      id: task.id,
      status: StatusRole.not_started,
    };

    const changeStatusResult = await sut.changeStatus(changeStatusParams);

    const changedStatus = await taskRepository.findById(task.id);

    expect(changeStatusResult).toBeTruthy();
    expect(changedStatus?.status).toBe('not_started');
  });

  test('Should return true and update start_at and due_date when the new status is complete but it do not had in_progress', async () => {
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

    const changeStatusParams = {
      id: task.id,
      status: StatusRole.complete,
    };

    const changeStatusResult = await sut.changeStatus(changeStatusParams);

    const changedStatus = await taskRepository.findById(task.id);

    expect(changeStatusResult).toBeTruthy();
    expect(changedStatus?.started_at).toBeTruthy();
    expect(changedStatus?.due_date).toBeTruthy();
    expect(changedStatus?.status).toBe(StatusRole.complete);
  });

  test('Should update next dependency and return true when change Task status on success', async () => {
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

    const taskParams2 = {
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: taskList.id,
      dependency_id: task.id,
    };

    const task2 = await taskRepository.create(taskParams2);

    const changeStatusParams = {
      id: task.id,
      status: StatusRole.in_progress,
    };

    await sut.changeStatus(changeStatusParams);

    const changeStatusParams2 = {
      id: task.id,
      status: StatusRole.complete,
    };

    const changeStatusResult = await sut.changeStatus(changeStatusParams2);

    const changedStatus = await taskRepository.findById(task2.id);

    expect(changeStatusResult).toBeTruthy();
    expect(changedStatus?.status).toBe(StatusRole.in_progress);
  });

  test('Should return an AppError if the dependency status is not complete', async () => {
    const { sut, taskRepository } = makeSut();

    jest.spyOn(taskRepository, 'findById').mockResolvedValue({
      id: 1,
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: 1,
      status: StatusRole.not_started,
      dependency_id: 2,
      created_at: faker.date.past(),
      updated_at: faker.date.past(),
    });

    const changeStatusParams2 = {
      id: 1,
      status: StatusRole.complete,
    };

    const changeStatusResult = sut.changeStatus(changeStatusParams2);

    expect(changeStatusResult).rejects.toBeInstanceOf(AppError);
  });

  test('Should return an AppError if Task does not exists', async () => {
    const { sut } = makeSut();

    const changeStatusParams = {
      id: 1111,
      status: StatusRole.in_progress,
    };
    const task = sut.changeStatus(changeStatusParams);

    expect(task).rejects.toBeInstanceOf(AppError);
  });

  test('Should return an AppError if Task is already completed', async () => {
    const taskRepository = new InMemoryTaskRepository();
    const taskListRepository = new InMemoryTaskListRepository();
    const sut = new ServiceChangeTaskStatus(taskRepository, taskListRepository);

    jest.spyOn(taskRepository, 'findById').mockResolvedValue({
      id: 1,
      name: faker.vehicle.model(),
      duration: 3,
      task_list_id: 1,
      status: StatusRole.complete,
      created_at: faker.date.past(),
      updated_at: faker.date.past(),
    });

    const changeStatusParams = {
      id: 1111,
      status: StatusRole.in_progress,
    };
    const result = sut.changeStatus(changeStatusParams);

    expect(result).rejects.toBeInstanceOf(AppError);
  });
});
