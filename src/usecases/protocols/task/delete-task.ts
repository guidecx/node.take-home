export interface DeleteTask {
  delete: (id: number) => Promise<DeleteTask.Result>;
}

export namespace DeleteTask {
  export type Result = boolean;
}
