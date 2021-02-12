import { StatusRole } from '@/models/task';

export interface ChangeTaskStatus {
  changeStatus: (params: ChangeTaskStatus.Params) => ChangeTaskStatus.Result;
}

export namespace ChangeTaskStatus {
  export type Params = {
    id: number;
    status: StatusRole;
  };

  export type Result = Promise<boolean>;
}
