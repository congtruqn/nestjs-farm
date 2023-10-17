export interface MessageResponse<T> {
  message: string;
  data: T;
  duration: string;
}
