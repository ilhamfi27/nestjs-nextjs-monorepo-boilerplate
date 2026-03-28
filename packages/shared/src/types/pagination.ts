export type PaginatedData<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};
