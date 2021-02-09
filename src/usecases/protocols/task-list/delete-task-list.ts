export interface DeleteTaskList {
  delete: (id: number) => DeleteTaskList.Result;
}

export namespace DeleteTaskList {
  export type Result = Promise<boolean>;
}
