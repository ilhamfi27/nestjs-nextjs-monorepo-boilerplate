/** Format a Date (or ISO string) as a locale date string. */
export function formatDate(value: Date | string, locale = 'en-US'): string {
  return new Date(value).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Return true if the given value is a valid Date. */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/** Return the difference in days between two dates (a - b). */
export function diffInDays(a: Date, b: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((a.getTime() - b.getTime()) / MS_PER_DAY);
}
