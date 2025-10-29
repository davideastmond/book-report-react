export type ApiResult<T> = {
  message?: string | null;
  success: boolean;
  data?: T | null;
  status?: number;
};
