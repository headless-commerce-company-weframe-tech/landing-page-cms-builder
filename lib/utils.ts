import { clsx, type ClassValue } from "clsx";
import type { Reference } from "@/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertDate = (
  date: Date | string | undefined,
  formatString: string = "dd/MM/yyyy",
): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "";

  return format(dateObj, formatString);
};

export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export type Flatten<T extends object, K extends keyof T> = T extends {
  [Key in K]: infer D;
}
  ? D
  : never;

export function referenceToLink(reference?: Reference) {
  const model = reference?.model;
  const data = reference?.value?.data;

  if (!data) return "";

  if (data.url) {
    return `${data.url}`;
  }

  if (data.slug && model) {
    return `${model}/${encodeURI(data.slug)}`;
  }

  if (model) {
    return `${model}`;
  }

  return "";
}

// From `escape-string-regexp` npm package
// https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
export function escapeStringRegexp(string: string) {
  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

export function createMultiKeywordSearchRegex(search: string) {
  const lookaheads = search
    .split(" ")
    .map((term) => term.trim())
    .filter(Boolean)
    .map(escapeStringRegexp)
    .map((term) => `(?=.*${term})`)
    .join("");

  return `^${lookaheads}.*$`;
}
