/**
 * Images de démonstration générées en SVG (simule un stockage d'images) :
 * un dégradé et un motif, déterminés par le nom. Sert aussi d'image par défaut.
 */
const PALETTES = [
  ["#f59e0b", "#ef4444", "#be185d"],
  ["#0ea5e9", "#6366f1", "#7c3aed"],
  ["#10b981", "#0d9488", "#0369a1"],
  ["#f97316", "#db2777", "#7c3aed"],
  ["#84cc16", "#16a34a", "#0f766e"],
  ["#facc15", "#f97316", "#dc2626"],
] as const;

function hash(texte: string): number {
  let h = 0;
  for (const c of texte) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function imageDemo(nom: string): string {
  const h = hash(nom);
  const [a, b, c] = PALETTES[h % PALETTES.length]!;
  const cercles = Array.from({ length: 6 }, (_, i) => {
    const x = (h >> (i * 3)) % 1080;
    const y = (h >> (i * 2 + 1)) % 1080;
    const r = 80 + ((h >> i) % 260);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity="${0.06 + (i % 3) * 0.04}"/>`;
  }).join("");
  const defaut = nom === "defaut";
  const icone = defaut
    ? `<g transform="translate(400 400)" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="22" stroke-linecap="round"><rect x="20" y="50" width="240" height="210" rx="28"/><path d="M20 120h240M80 20v60M200 20v60"/></g>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080"><defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs><rect width="1080" height="1080" fill="url(#g)"/>${cercles}${icone}</svg>`;
}
