import { Request, Response } from 'express';
import DbTaskListRepository from '~/repositories/db-task-list/db-task-list-repository';
import {
  ServiceListTaskList,
  ServiceCreateTaskList,
  ServiceUpdateTaskList,
  ServiceDeleteTaskList,
} from '~/usecases/implementations/task-list';

const dbTaskListRepository = new DbTaskListRepository();
export async function index(req: Request, res: Response) {
  try {
    const serviceListTaskList = new ServiceListTaskList(dbTaskListRepository);

    const lists = await serviceListTaskList.list();

    res.json(lists);
  } catch (err) {
    console.log(err);
  }
}

export async function store(req: Request, res: Response) {
  try {
    const serviceCreateTaskList = new ServiceCreateTaskList(
      dbTaskListRepository,
    );
    const { name, due_date } = req.body;

    const newTaskList = serviceCreateTaskList.create({ name, due_date });
    res.json(newTaskList);
  } catch (err) {
    res.status(500);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const serviceCreateTaskList = new ServiceUpdateTaskList(
      dbTaskListRepository,
    );
    const id = Number(req.params.taskListId);
    const { name, due_date } = req.body;

    const newTaskList = serviceCreateTaskList.update({ id, name, due_date });
    res.json(newTaskList);
  } catch (err) {
    res.status(500);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const serviceCreateTaskList = new ServiceDeleteTaskList(
      dbTaskListRepository,
    );
    const id = Number(req.params.taskListId);

    const newTaskList = serviceCreateTaskList.delete(id);
    res.json(newTaskList);
  } catch (err) {
    res.status(500);
  }
}
