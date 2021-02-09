export interface OrderTask {
  order: (ids: number[]) => Promise<OrderTask.Result>;
}

export namespace OrderTask {
  export type Result = boolean;
}
