export interface DeleteTask {
  delete: (id: number) => DeleteTask.Result;
}

export namespace DeleteTask {
  export type Result = Promise<boolean>;
}
