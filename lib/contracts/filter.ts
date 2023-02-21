export interface Filter {
  apply<T>(value: T): T;
}
