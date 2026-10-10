const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

function startDate(period: string): number {
  const match = period.trim().match(/^(?:([a-z]+)\s+)?(\d{4})\b/i);
  if (!match) return Number.NEGATIVE_INFINITY;

  const month = match[1]
    ? MONTHS.indexOf(match[1].slice(0, 3).toLowerCase())
    : -1;
  // Year-only dates follow dated entries in the same year; never invent a month.
  return Number(match[2]) * 12 + month;
}

/** Newest start first, preserving saved order for ties and undated entries. */
export function sortTimeline<T extends { period: string }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => {
    const aStart = startDate(a.period);
    const bStart = startDate(b.period);
    return aStart === bStart ? 0 : bStart > aStart ? 1 : -1;
  });
}
