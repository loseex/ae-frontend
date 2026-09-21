import type { FiltersState } from "./types.d";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export function getByPath(source: unknown, path: string): unknown {
  let current: unknown = source;
  for (const segment of path.split(".")) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

export function compareValues(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number")
    return a < b ? -1 : a > b ? 1 : 0;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "boolean" && typeof b === "boolean")
    return Number(a) - Number(b);
  return collator.compare(String(a), String(b));
}

export function includesQuery(value: unknown, query: string): boolean {
  if (value === null || value === undefined) return false;
  return String(value).toLocaleLowerCase().includes(query.toLocaleLowerCase());
}

export function formatValue(value: unknown): string {
  return value === null || value === undefined ? "" : String(value);
}

export function toCssSize(
  size: number | string | undefined,
): string | undefined {
  return typeof size === "number" ? `${size}px` : size;
}

export function isSameFilters(a: FiltersState, b: FiltersState): boolean {
  const keysA = Object.keys(a);
  return (
    keysA.length === Object.keys(b).length &&
    keysA.every((key) => a[key] === b[key])
  );
}
