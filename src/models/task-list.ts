import { Task } from './task';

export interface TaskList {
  id: number;
  name: string;
  started_at: Date | null;
  due_date: Date;
  forecasted_completion_date: Date;
  tasks?: Task[];
  created_at: Date;
  updated_at: Date;
}
