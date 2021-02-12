import { TaskModel } from './task';

export interface TaskListModel {
  id: number;
  name: string;
  started_at: Date | null;
  due_date: Date;
  forecasted_completion_date: Date | null;
  tasks?: TaskModel[];
  created_at: Date;
  updated_at: Date;
}
