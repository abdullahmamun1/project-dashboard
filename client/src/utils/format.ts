const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
const dateTimeFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

export const formatDate = (value: string | Date) => dateFormatter.format(new Date(value));
export const formatDateTime = (value: string | Date) => dateTimeFormatter.format(new Date(value));

/** "https://github.com/owner/repo" → "github.com/owner/repo" for compact display. */
export const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
