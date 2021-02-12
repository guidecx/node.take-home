import { Request, Response } from 'express';
import DbTaskListRepository from '@/repositories/db-task-list/db-task-list-repository';
import DbTaskRepository from '@/repositories/db-task-list/db-task-repository';
import {
  ServiceListTask,
  ServiceCreateTask,
  ServiceUpdateTask,
  ServiceDeleteTask,
  ServiceChangeTaskStatus,
} from '@/usecases/implementations/task';
import { handleError } from '@/util/errors/handle-errors';

class TaskController {
  public async index(req: Request, res: Response) {
    try {
      const dbTaskRepository = new DbTaskRepository();
      const serviceListTaskList = new ServiceListTask(dbTaskRepository);

      const lists = await serviceListTaskList.list();

      res.json(lists);
    } catch (err) {
      return handleError(res, err);
    }
  }

  public async store(req: Request, res: Response) {
    try {
      const dbTaskListRepository = new DbTaskListRepository();
      const dbTaskRepository = new DbTaskRepository();
      const serviceCreateTask = new ServiceCreateTask(
        dbTaskRepository,
        dbTaskListRepository,
      );
      const { name, duration, task_list_id, dependency_id } = req.body;

      const newTask = await serviceCreateTask.create({
        name,
        duration,
        task_list_id,
        dependency_id,
      });
      res.json(newTask);
    } catch (err) {
      return handleError(res, err);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const dbTaskListRepository = new DbTaskListRepository();
      const dbTaskRepository = new DbTaskRepository();
      const serviceCreateTaskList = new ServiceUpdateTask(
        dbTaskRepository,
        dbTaskListRepository,
      );
      const id = Number(req.params.taskListId);
      const { name, duration } = req.body;

      const newTaskList = await serviceCreateTaskList.update({
        id,
        name,
        duration,
      });
      res.json(newTaskList);
    } catch (err) {
      return handleError(res, err);
    }
  }

  public async remove(req: Request, res: Response) {
    try {
      const dbTaskListRepository = new DbTaskListRepository();
      const dbTaskRepository = new DbTaskRepository();
      const serviceCreateTaskList = new ServiceDeleteTask(
        dbTaskRepository,
        dbTaskListRepository,
      );
      const id = Number(req.params.taskListId);

      const newTaskList = await serviceCreateTaskList.delete(id);
      res.json(newTaskList);
    } catch (err) {
      return handleError(res, err);
    }
  }

  public async changeStatus(req: Request, res: Response) {
    try {
      const dbTaskListRepository = new DbTaskListRepository();
      const dbTaskRepository = new DbTaskRepository();
      const serviceCreateTaskList = new ServiceChangeTaskStatus(
        dbTaskRepository,
        dbTaskListRepository,
      );
      const id = Number(req.params.taskListId);
      const { status } = req.body;

      const newTaskList = await serviceCreateTaskList.changeStatus({
        id,
        status,
      });
      return res.json(newTaskList);
    } catch (err) {
      return handleError(res, err);
    }
  }
}

export default TaskController;
