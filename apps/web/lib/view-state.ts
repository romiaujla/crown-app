export enum ViewStatusEnum {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type ViewLoadingState = {
  status: ViewStatusEnum.LOADING;
};

export type ViewErrorState = {
  status: ViewStatusEnum.ERROR;
  message: string;
};

export type ViewSuccessState<TValue, TKey extends string> = {
  status: ViewStatusEnum.SUCCESS;
} & Record<TKey, TValue>;

export type ViewState<TValue, TKey extends string> =
  | ViewLoadingState
  | ViewSuccessState<TValue, TKey>
  | ViewErrorState;
