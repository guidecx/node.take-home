import { Router } from 'express';

import { health, home } from '@/controllers/root';
import TaskListController from '@/controllers/task-list';
import TaskController from '@/controllers/task';

const router = Router();

const taskListController = new TaskListController();
const taskController = new TaskController();

router.get('/', home);
router.get('/health', health);

router.get('/api/task-lists', taskListController.index);
router.post('/api/task-lists', taskListController.store);
router.put('/api/task-lists/:taskListId', taskListController.update);
router.delete('/api/task-lists/:taskListId', taskListController.remove);

router.get('/api/tasks', taskController.index);
router.post('/api/tasks', taskController.store);
router.put('/api/tasks/:taskListId', taskController.update);
router.delete('/api/tasks/:taskListId', taskController.remove);

router.put('/api/task/changeStatus/:taskListId', taskController.changeStatus);

export default router;
