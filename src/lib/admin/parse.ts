import type { Field } from "./collections";

export type ParseResult =
  | { ok: true; values: Record<string, unknown> }
  | { ok: false; errors: Record<string, string> };

const URLISH = /^(https?:\/\/|mailto:|\/)/i;

/** Converts a submitted form into column values according to the field definitions. */
export function parseFields(fields: Field[], form: FormData): ParseResult {
  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const raw = form.get(field.name);
    const text = typeof raw === "string" ? raw.trim() : "";

    switch (field.type) {
      case "date":
        if (
          text &&
          (!/^\d{4}-\d{2}-\d{2}$/.test(text) ||
            Number.isNaN(Date.parse(text)) ||
            new Date(text).toISOString().slice(0, 10) !== text)
        )
          errors[field.name] = "Use a valid date (YYYY-MM-DD)";
        values[field.name] = text;
        break;
      case "boolean":
        values[field.name] = raw === "on" || raw === "true";
        continue;
      case "tags":
        values[field.name] = text
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        break;
      case "lines":
        values[field.name] = text
          .split(/\r?\n/)
          .map((t) => t.trim())
          .filter(Boolean);
        break;
      case "url":
      case "image":
        if (text && !URLISH.test(text)) {
          errors[field.name] = "Must start with https://, mailto: or /";
        }
        values[field.name] = text;
        break;
      case "select":
        if (
          field.options &&
          text &&
          !field.options.some((o) => o.value === text)
        ) {
          errors[field.name] = "Pick one of the listed options";
        }
        values[field.name] = text;
        break;
      default:
        values[field.name] = text;
    }

    if (field.required && !text)
      errors[field.name] = `${field.label} is required`;
  }

  if (
    typeof values.slug === "string" &&
    values.slug &&
    !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(values.slug)
  ) {
    errors.slug = "Use lowercase letters, numbers and single hyphens";
  }

  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, values };
}

/** "Label | value" per line, used for socials and stats on the profile. */
export function parsePairs(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter(([label, value]) => label && value)
    .map(([label, value]) => ({ label, value }));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
