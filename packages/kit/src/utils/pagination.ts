import type { PaginatedData } from '../types/pagination';

/** Build a PaginatedData envelope from a raw list + total count. */
export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedData<T> {
  return { items, total, page, pageSize };
}

/** Calculate the number of pages for a given total and page size. */
export function totalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize);
}

/** Return the zero-based offset for a page (useful for SQL OFFSET). */
export function pageOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}
