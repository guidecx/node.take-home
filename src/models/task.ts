// eslint-disable-next-line no-shadow
export enum StatusRole {
  not_started = 'not_started',
  in_progress = 'in_progress',
  complete = 'complete',
}

export interface TaskModel {
  id: number;

  name: string;

  status: StatusRole;

  duration: number;

  started_at?: Date;

  due_date?: Date;

  dependency_id?: number | null | undefined;

  task_list_id: number;

  created_at: Date;

  updated_at: Date;
}
