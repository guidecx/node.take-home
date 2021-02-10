import express from 'express';
import compression from 'compression';
import lusca from 'lusca';

import * as settings from './config/settings';
import { health, home } from '~/controllers/root';
import * as taskListController from '~/controllers/task-list';
import * as taskController from '~/controllers/task';

const app = express();
app.set('port', settings.port);

app.use(compression());

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(express.json());

app.get('/', home);
app.get('/health', health);

app.get('/api/task-lists', taskListController.index);
app.post('/api/task-lists', taskListController.store);
app.put('/api/task-lists/:taskListId', taskListController.update);
app.delete('/api/task-lists/:taskListId', taskListController.remove);

app.get('/api/tasks', taskController.index);
app.post('/api/tasks', taskController.store);
app.put('/api/tasks/:taskListId', taskController.update);
app.delete('/api/tasks/:taskListId', taskController.remove);

app.put('/api/task/changeStatus/:taskListId', taskController.changeStatus);
export default app;
