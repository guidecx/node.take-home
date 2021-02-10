export interface ChangeTaskStatus {
  changeStatus: (params: ChangeTaskStatus.Params) => ChangeTaskStatus.Result;
}

export namespace ChangeTaskStatus {
  export type Params = {
    id: number;
    status: string;
  };

  export type Result = Promise<boolean>;
}
