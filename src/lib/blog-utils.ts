export function readingMinutes(body: string) {
  return Math.max(
    1,
    Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 220),
  );
}
export function displayPostDate(date: string) {
  if (!date) return "";
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
