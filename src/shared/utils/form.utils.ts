export const required =
  (message: string) =>
  ({ value }: { value: string }) =>
    value?.trim() ? undefined : message;
