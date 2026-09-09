// The `portfolio_projects` table (already created in Supabase) has a single
// `description` text column — but the admin form needs both a short summary
// (for cards/previews) and a longer detailed write-up (for the project
// modal). Rather than add a column, both are packed into that one field as
// JSON. This keeps the existing schema untouched, per the "do not modify
// the database schema" rule.
//
// Anything already in `description` that isn't this JSON shape (e.g. plain
// text from before this system existed) is treated as the detailed text,
// with a truncated version used as the short summary — so nothing breaks
// on rows that predate this convention.

export type UnpackedDescription = {
  short: string;
  detailed: string;
};

const MARKER = "__apsh_desc_v1__";

export function packDescription(short: string, detailed: string): string {
  return JSON.stringify({ marker: MARKER, short, detailed });
}

export function unpackDescription(raw: string | null): UnpackedDescription {
  if (!raw) return { short: "", detailed: "" };

  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.marker === MARKER) {
      return { short: parsed.short ?? "", detailed: parsed.detailed ?? "" };
    }
  } catch {
    // Not JSON — fall through to treating it as plain legacy text.
  }

  const plain = raw.trim();
  const short = plain.length > 140 ? `${plain.slice(0, 137)}...` : plain;
  return { short, detailed: plain };
}
