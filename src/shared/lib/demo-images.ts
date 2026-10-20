/**
 * Images de démonstration générées en SVG (simule un stockage d'images) :
 * un dégradé de gris et un motif, déterminés par le nom. Sert aussi d'image par défaut.
 */
const PALETTES = [
  ["#0a0a0a", "#262626", "#404040"],
  ["#171717", "#404040", "#525252"],
  ["#262626", "#3f3f46", "#52525b"],
  ["#0a0a0a", "#1c1917", "#44403c"],
] as const;

function hash(text: string): number {
  let h = 0;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function demoImage(name: string): string {
  const h = hash(name);
  const [a, b, c] = PALETTES[h % PALETTES.length]!;
  const circles = Array.from({ length: 6 }, (_, i) => {
    const x = (h >> (i * 3)) % 1080;
    const y = (h >> (i * 2 + 1)) % 1080;
    const r = 80 + ((h >> i) % 260);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity="${0.06 + (i % 3) * 0.04}"/>`;
  }).join("");
  const fallback = name === "defaut";
  const icon = fallback
    ? `<g transform="translate(400 400)" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="22" stroke-linecap="round"><rect x="20" y="50" width="240" height="210" rx="28"/><path d="M20 120h240M80 20v60M200 20v60"/></g>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080"><defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs><rect width="1080" height="1080" fill="url(#g)"/>${circles}${icon}</svg>`;
}
