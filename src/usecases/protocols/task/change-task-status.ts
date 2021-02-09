export interface UpdateTaskStatus {
  changeStatus: (
    params: UpdateTaskStatus.Params,
  ) => Promise<UpdateTaskStatus.Result>;
}

export namespace UpdateTaskStatus {
  export type Params = {
    id: number;
    status: string;
  };

  export type Result = boolean;
}
