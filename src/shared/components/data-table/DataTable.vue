<script setup lang="ts" generic="T extends object">
import { computed, onBeforeUnmount, reactive, toRaw, watch } from "vue";
import type {
  CellContext,
  DataTableColumn,
  FiltersState,
  SortDirection,
  SortState,
} from "./types.d";
import {
  compareValues,
  formatValue,
  getByPath,
  includesQuery,
  isSameFilters,
  toCssSize,
} from "./utils";

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn<T>[];
    rows: T[];
    rowKey?: string | ((row: T, index: number) => PropertyKey);
    serverSide?: boolean;
    loading?: boolean;
    searchDebounce?: number;
    emptyText?: string;
    loadingText?: string;
  }>(),
  {
    serverSide: false,
    loading: false,
    searchDebounce: 300,
    emptyText: "Нет данных",
    loadingText: "Загрузка…",
  },
);

const sortState = defineModel<SortState | null>("sort", { default: null });
const filtersState = defineModel<FiltersState>("filters", {
  default: () => ({}),
});

const emit = defineEmits<{
  "sort-change": [sort: SortState | null];
  "search-change": [filters: FiltersState];
}>();

defineSlots<{
  empty?(): unknown;
  [name: `cell-${string}`]: ((ctx: CellContext<T>) => unknown) | undefined;
}>();

const searchableColumns = computed(() =>
  props.columns.filter((column) => column.search),
);
const hasSearch = computed(() => searchableColumns.value.length > 0);

const tableLayout = computed(() =>
  props.columns.some((column) => column.width !== undefined) ? "fixed" : "auto",
);

function getCellValue(column: DataTableColumn<T>, row: T): unknown {
  return column.value ? column.value(row) : getByPath(row, column.key);
}

function getContext(
  column: DataTableColumn<T>,
  row: T,
  index: number,
): CellContext<T> {
  return { row, value: getCellValue(column, row), index, column };
}

function getRenderProps(
  column: DataTableColumn<T>,
  row: T,
  index: number,
): Record<string, unknown> {
  const context = getContext(column, row, index);
  const custom = column.render?.props;
  if (typeof custom === "function") return custom(context);
  return custom ?? { value: context.value, row, index };
}

function getRowKey(row: T, index: number): PropertyKey {
  const { rowKey } = props;
  if (typeof rowKey === "function") return rowKey(row, index);
  if (typeof rowKey === "string") {
    const key = getByPath(row, rowKey);
    if (typeof key === "string" || typeof key === "number") return key;
  }
  return index;
}

function getSortDirection(column: DataTableColumn<T>): SortDirection | null {
  const current = sortState.value;
  return current !== null && current.key === column.key
    ? current.direction
    : null;
}

function getAriaSort(
  column: DataTableColumn<T>,
): "ascending" | "descending" | "none" | undefined {
  if (!column.sort) return undefined;
  const direction = getSortDirection(column);
  if (direction === null) return "none";
  return direction === "asc" ? "ascending" : "descending";
}

function toggleSort(column: DataTableColumn<T>): void {
  const direction = getSortDirection(column);
  const next: SortState | null =
    direction === null
      ? { key: column.key, direction: "asc" }
      : direction === "asc"
        ? { key: column.key, direction: "desc" }
        : null;

  sortState.value = next;
  emit("sort-change", next);
}

function applySort(rows: T[]): T[] {
  const current = sortState.value;
  if (current === null) return rows;

  const column = props.columns.find((item) => item.key === current.key);
  if (!column || !column.sort) return rows;

  const factor = current.direction === "asc" ? 1 : -1;
  const customCompare = typeof column.sort === "function" ? column.sort : null;

  return [...rows].sort((rowA, rowB) => {
    if (customCompare) return customCompare(rowA, rowB) * factor;

    const a = getCellValue(column, rowA);
    const b = getCellValue(column, rowB);
    const aIsEmpty = a === null || a === undefined;
    const bIsEmpty = b === null || b === undefined;

    if (aIsEmpty || bIsEmpty)
      return aIsEmpty === bIsEmpty ? 0 : aIsEmpty ? 1 : -1;

    return compareValues(a, b) * factor;
  });
}

const draft = reactive<Record<string, string>>({ ...filtersState.value });
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

function getSearchPlaceholder(column: DataTableColumn<T>): string {
  return (
    (typeof column.search === "object"
      ? column.search.placeholder
      : undefined) ?? "Поиск…"
  );
}

function commitFilters(): void {
  clearTimeout(debounceTimer);

  const next: FiltersState = {};
  for (const column of searchableColumns.value) {
    const query = (draft[column.key] ?? "").trim();
    if (query !== "") next[column.key] = query;
  }

  if (isSameFilters(next, filtersState.value)) return;
  filtersState.value = next;
  emit("search-change", next);
}

function onSearchInput(column: DataTableColumn<T>, event: Event): void {
  draft[column.key] = (event.target as HTMLInputElement).value;

  clearTimeout(debounceTimer);
  if (props.searchDebounce > 0) {
    debounceTimer = setTimeout(commitFilters, props.searchDebounce);
  } else {
    commitFilters();
  }
}

watch(
  filtersState,
  (next) => {
    for (const column of searchableColumns.value) {
      const committed = next[column.key] ?? "";
      if ((draft[column.key] ?? "").trim() !== committed)
        draft[column.key] = committed;
    }
  },
  { deep: true },
);

onBeforeUnmount(() => clearTimeout(debounceTimer));

function matchesQuery(
  column: DataTableColumn<T>,
  row: T,
  query: string,
): boolean {
  const value = getCellValue(column, row);
  const custom =
    typeof column.search === "object" ? column.search.match : undefined;
  return custom ? custom({ value, row, query }) : includesQuery(value, query);
}

function applyFilters(rows: T[]): T[] {
  const active = searchableColumns.value
    .map((column) => ({
      column,
      query: (filtersState.value[column.key] ?? "").trim(),
    }))
    .filter(({ query }) => query !== "");
  if (active.length === 0) return rows;

  return rows.filter((row) =>
    active.every(({ column, query }) => matchesQuery(column, row, query)),
  );
}

const displayedRows = computed<T[]>(() =>
  props.serverSide ? props.rows : applySort(applyFilters(props.rows)),
);
</script>

<template>
  <div class="dt" :class="{ 'dt--loading': loading }">
    <table class="dt__table" :style="{ tableLayout }" :aria-busy="loading">
      <colgroup>
        <col
          v-for="column in columns"
          :key="column.key"
          :style="{ width: toCssSize(column.width) }"
        />
      </colgroup>

      <thead class="dt__head">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="dt__th"
            :style="{ textAlign: column.align }"
            :aria-sort="getAriaSort(column)"
          >
            <button
              v-if="column.sort"
              type="button"
              class="dt__sort"
              :class="{
                'is-asc': getSortDirection(column) === 'asc',
                'is-desc': getSortDirection(column) === 'desc',
              }"
              @click="toggleSort(column)"
            >
              {{ column.title }}
              <svg
                class="dt__sort-icon"
                viewBox="0 0 10 14"
                aria-hidden="true"
                focusable="false"
              >
                <path class="dt__arrow dt__arrow--asc" d="M5 1 9 6H1z" />
                <path class="dt__arrow dt__arrow--desc" d="M5 13 1 8h8z" />
              </svg>
            </button>
            <template v-else>{{ column.title }}</template>
          </th>
        </tr>

        <tr v-if="hasSearch">
          <td
            v-for="column in columns"
            :key="column.key"
            class="dt__search-cell"
          >
            <input
              v-if="column.search"
              class="dt__search"
              type="search"
              autocomplete="off"
              :value="draft[column.key] ?? ''"
              :placeholder="getSearchPlaceholder(column)"
              :aria-label="`Поиск по колонке «${column.title}»`"
              @input="onSearchInput(column, $event)"
              @keydown.enter="commitFilters"
            />
          </td>
        </tr>
      </thead>

      <tbody class="dt__body">
        <tr
          v-for="(row, index) in displayedRows"
          :key="getRowKey(row, index)"
          class="dt__row"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="dt__td"
            :style="{ textAlign: column.align }"
          >
            <slot
              :name="`cell-${column.key}`"
              v-bind="getContext(column, row, index)"
            >
              <component
                :is="toRaw(column.render.component)"
                v-if="column.render"
                v-bind="getRenderProps(column, row, index)"
              />
              <template v-else>{{
                formatValue(getCellValue(column, row))
              }}</template>
            </slot>
          </td>
        </tr>

        <tr v-if="displayedRows.length === 0">
          <td class="dt__state" :colspan="columns.length">
            <template v-if="loading">{{ loadingText }}</template>
            <slot v-else name="empty">{{ emptyText }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.dt {
  --_text: var(--dt-text-color, #1f2933);
  --_muted: var(--dt-muted-color, #66707c);
  --_border: var(--dt-border-color, #dfe3e8);
  --_head-bg: var(--dt-header-bg, #f5f6f8);
  --_hover-bg: var(--dt-row-hover-bg, #fafbfc);
  --_bg: var(--dt-background, #fff);
  --_accent: var(--dt-accent-color, #2f5fd0);
  --_radius: var(--dt-radius, 6px);
  --_padding: var(--dt-cell-padding, 0.625rem 0.875rem);

  overflow-x: auto;
  color: var(--_text);
  font-size: var(--dt-font-size, 0.875rem);
  line-height: 1.4;
  background: var(--_bg);
  border: 1px solid var(--_border);
  border-radius: var(--_radius);
}

.dt__table {
  width: 100%;
  border-collapse: collapse;
}

/* Шапка */
.dt__th,
.dt__search-cell {
  background: var(--_head-bg);
}

.dt__th {
  padding: var(--_padding);
  font-weight: 600;
  text-align: left;
  vertical-align: bottom;
}

.dt__search-cell {
  padding: 0 0.875rem 0.625rem;
}

.dt__head > tr:last-child > * {
  border-bottom: 1px solid var(--_border);
}

/* Сортировка */
.dt__sort {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-align: inherit;
  cursor: pointer;
  background: none;
  border: 0;
}

.dt__sort:focus-visible {
  border-radius: 2px;
  outline: 2px solid var(--_accent);
  outline-offset: 3px;
}

.dt__sort-icon {
  flex: none;
  width: 0.625rem;
  height: 0.875rem;
}

.dt__arrow {
  fill: var(--_muted);
  opacity: 0.45;
}

.dt__sort:hover .dt__arrow {
  opacity: 0.8;
}

.dt__sort.is-asc .dt__arrow--asc,
.dt__sort.is-desc .dt__arrow--desc {
  fill: var(--_accent);
  opacity: 1;
}

/* Поиск */
.dt__search {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 0.35rem 0.5rem;
  font: inherit;
  color: inherit;
  background: var(--_bg);
  border: 1px solid var(--_border);
  border-radius: calc(var(--_radius) - 2px);
}

.dt__search::placeholder {
  color: var(--_muted);
}

.dt__search:focus-visible {
  outline: 2px solid var(--_accent);
  outline-offset: -1px;
}

/* Тело */
.dt__td {
  padding: var(--_padding);
  overflow-wrap: break-word;
  vertical-align: middle;
  font-variant-numeric: tabular-nums;
  border-bottom: 1px solid var(--_border);
}

.dt__row:last-child > .dt__td {
  border-bottom: 0;
}

.dt__row:hover {
  background: var(--_hover-bg);
}

.dt__state {
  padding: 1.75rem 1rem;
  color: var(--_muted);
  text-align: center;
}

.dt__body {
  transition: opacity 0.15s;
}

.dt--loading .dt__body {
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .dt__body {
    transition: none;
  }
}
</style>
