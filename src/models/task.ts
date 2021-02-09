export interface Task {
  id: number;

  name: string;

  status: string;

  duration: number;

  started_at?: Date;

  due_date?: Date;

  dependency_id?: number;

  task_list_id: number;

  created_at: Date;

  updated_at: Date;
}
