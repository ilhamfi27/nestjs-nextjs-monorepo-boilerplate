/** Capitalise the first letter of a string. */
export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Convert a string to kebab-case. */
export function toKebabCase(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/** Truncate a string to a maximum length, appending an ellipsis if needed. */
export function truncate(value: string, maxLength: number, ellipsis = '…'): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - ellipsis.length) + ellipsis;
}
