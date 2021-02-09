import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import lusca from 'lusca';

import * as settings from './config/settings';
import { health, home } from '~/controllers/root';
import * as taskList from '~/controllers/task-list';
import AppError from './util/errors/AppError';

const app = express();
app.set('port', settings.port);

app.use(compression());

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(express.json());

app.get('/', home);
app.get('/health', health);

app.get('/api/task-lists', taskList.index);

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);

  return res
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

export default app;
