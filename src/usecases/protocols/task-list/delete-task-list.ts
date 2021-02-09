export interface DeleteTaskList {
  delete: (id: number) => Promise<DeleteTaskList.Result>;
}

export namespace DeleteTaskList {
  export type Result = boolean;
}
