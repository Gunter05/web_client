/** Compare des noms sans tenir compte de la casse ni des accents (US-03). */
export function normaliser(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function slugifier(texte: string): string {
  return normaliser(texte)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export function nouvelId(): string {
  return crypto.randomUUID();
}

/** Identifiant court pour les liens permanents partagés sur WhatsApp. */
export function idCourt(): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  const octets = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(octets, (o) => alphabet[o % alphabet.length]).join("");
}
