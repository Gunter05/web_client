/** Morceau d'un texte : du texte simple, ou une adresse web à rendre en lien. */
export type TextPart =
  { type: "text"; text: string } | { type: "link"; text: string; href: string };

// Adresses commençant par http(s):// ou www., jusqu'au prochain espace
const URL = /\b(?:https?:\/\/|www\.)[^\s<>"]+/gi;
// Ponctuation de fin de phrase, qui n'appartient pas à l'adresse
const TRAILING = /[.,;:!?)\]»'"]+$/;

/**
 * Découpe un texte en morceaux de texte et d'adresses web, pour afficher les
 * adresses en liens. La ponctuation qui suit une adresse (point final,
 * parenthèse fermante…) reste du texte ; « www. » devient « https://www. ».
 */
export function splitLinks(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const match of text.matchAll(URL)) {
    const raw = match[0];
    const url = raw.replace(TRAILING, "");
    const start = match.index;
    if (start > last)
      parts.push({ type: "text", text: text.slice(last, start) });
    parts.push({
      type: "link",
      text: url,
      href: url.toLowerCase().startsWith("www.") ? `https://${url}` : url,
    });
    last = start + url.length;
  }
  if (last < text.length) parts.push({ type: "text", text: text.slice(last) });
  return parts;
}
