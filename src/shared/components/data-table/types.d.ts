import type { Component } from "vue";

export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}

export type FiltersState = Record<string, string>;

export interface CellContext<T> {
  row: T;
  value: unknown;
  index: number;
  column: DataTableColumn<T>;
}

export type SortComparator<T> = (a: T, b: T) => number;

export interface ColumnSearchOptions<T> {
  placeholder?: string;
  match?: (payload: { value: unknown; row: T; query: string }) => boolean;
}

export interface ColumnRender<T> {
  component: Component;
  props?:
    | Record<string, unknown>
    | ((ctx: CellContext<T>) => Record<string, unknown>);
}

export interface DataTableColumn<T = any> {
  key: string;
  title: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  value?: (row: T) => unknown;
  render?: ColumnRender<T>;
  sort?: boolean | SortComparator<T>;
  search?: boolean | ColumnSearchOptions<T>;
}
