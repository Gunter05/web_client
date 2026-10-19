/** Compare des noms sans tenir compte de la casse ni des accents (US-03). */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(text: string): string {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export function newId(): string {
  return crypto.randomUUID();
}

/** Identifiant court pour les liens permanents partagés sur WhatsApp. */
export function shortId(): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (o) => alphabet[o % alphabet.length]).join("");
}
