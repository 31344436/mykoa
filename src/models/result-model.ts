export class SuccessResultModel<T> {
  constructor(
    public data: T,
    public code: number = 1,
    public msg: string = 'Success',
    public time?: number
  ) {}
}

export class ErrorResultModel<T> {
  constructor(
    public msg: string = 'Error',
    public code: number = 0,
    public data?: T,
    public time?: number
  ) {}
}
