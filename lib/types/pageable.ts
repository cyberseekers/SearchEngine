export interface Pageable<T extends unknown[]> {
  content: T;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
