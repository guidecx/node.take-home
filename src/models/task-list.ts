import client from '~/db/client';
import { Task } from './task';

export interface TaskList {
  id: number;
  name: string;
  started_at: Date;
  due_date: Date;
  forecasted_completion_date: Date;
  tasks: Task[];
  created_at: Date;
  updated_at: Date;
}
export default client<TaskList>('task_lists');
