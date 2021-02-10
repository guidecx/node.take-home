import { Request, Response } from 'express';
import DbTaskListRepository from '~/repositories/db-task-list/db-task-list-repository';
import DbTaskRepository from '~/repositories/db-task-list/db-task-repository';
import {
  ServiceListTask,
  ServiceCreateTask,
  ServiceUpdateTask,
  ServiceDeleteTask,
  ServiceChangeTaskStatus,
} from '~/usecases/implementations/task';

const dbTaskListRepository = new DbTaskListRepository();
const dbTaskRepository = new DbTaskRepository();
export async function index(req: Request, res: Response) {
  try {
    const serviceListTaskList = new ServiceListTask(dbTaskRepository);

    const lists = await serviceListTaskList.list();

    res.json(lists);
  } catch (err) {
    console.log(err);
  }
}

export async function store(req: Request, res: Response) {
  try {
    const serviceCreateTask = new ServiceCreateTask(
      dbTaskRepository,
      dbTaskListRepository,
    );
    const { name, duration, task_list_id, dependency_id } = req.body;

    const newTask = serviceCreateTask.create({
      name,
      duration,
      task_list_id,
      dependency_id,
    });
    res.json(newTask);
  } catch (err) {
    res.status(500);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const serviceCreateTaskList = new ServiceUpdateTask(
      dbTaskRepository,
      dbTaskListRepository,
    );
    const id = Number(req.params.taskListId);
    const { name, duration } = req.body;

    const newTaskList = serviceCreateTaskList.update({ id, name, duration });
    res.json(newTaskList);
  } catch (err) {
    res.status(500);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const serviceCreateTaskList = new ServiceDeleteTask(
      dbTaskRepository,
      dbTaskListRepository,
    );
    const id = Number(req.params.taskListId);

    const newTaskList = serviceCreateTaskList.delete(id);
    res.json(newTaskList);
  } catch (err) {
    res.status(500);
  }
}

export async function changeStatus(req: Request, res: Response) {
  try {
    const serviceCreateTaskList = new ServiceChangeTaskStatus(
      dbTaskRepository,
      dbTaskListRepository,
    );
    const id = Number(req.params.taskListId);
    const { status } = req.body;

    const newTaskList = serviceCreateTaskList.changeStatus({ id, status });
    res.json(newTaskList);
  } catch (err) {
    res.status(500);
  }
}
