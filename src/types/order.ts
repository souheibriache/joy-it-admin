export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

export type OrderOptionsDto = {
  createdAt?: Order;
  id?: Order;
};

export interface PageDto<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
