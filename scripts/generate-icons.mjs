/**
 * Génère les icônes de l'application installable (PWA) à partir du logo :
 * un « C » blanc sur fond noir, dessiné en vectoriel (indépendant des polices).
 * À relancer si le logo change : `npm run icons`.
 *
 * - public/icons/icon-192.png, icon-512.png : icônes du manifeste (coins arrondis)
 * - public/icons/icon-maskable-512.png : variante « maskable » (Android découpe
 *   l'icône en cercle ou en goutte : le « C » reste dans la zone sûre de 80 %)
 * - src/app/apple-icon.png : écran d'accueil iPhone (carré plein, iOS arrondit)
 * - src/app/icon.svg : icône de l'onglet du navigateur (nette à toute taille)
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const BACKGROUND = "#171717"; // couleur « primary » du thème clair
const FOREGROUND = "#ffffff";

/** « C » centré : un arc épais ouvert à droite, à l'échelle `scale` du carré. */
function letterC(size, scale) {
  const center = size / 2;
  const radius = size * 0.22 * scale;
  const stroke = size * 0.12 * scale;
  const opening = (50 * Math.PI) / 180; // demi-ouverture du « C »
  const x = center + radius * Math.cos(opening);
  const yTop = center - radius * Math.sin(opening);
  const yBottom = center + radius * Math.sin(opening);
  return `<path d="M ${x} ${yTop} A ${radius} ${radius} 0 1 0 ${x} ${yBottom}" fill="none" stroke="${FOREGROUND}" stroke-width="${stroke}" stroke-linecap="round"/>`;
}

/**
 * @param {number} size côté en pixels
 * @param {{ rounded: boolean, scale: number }} options coins arrondis, taille du « C »
 */
function svg(size, { rounded, scale }) {
  const radius = rounded ? size * 0.22 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${BACKGROUND}"/>
  ${letterC(size, scale)}
</svg>`;
}

async function png(path, size, options) {
  await sharp(Buffer.from(svg(size, options)))
    .png()
    .toFile(path);
  console.log(`✓ ${path}`);
}

await mkdir("public/icons", { recursive: true });
await png("public/icons/icon-192.png", 192, { rounded: true, scale: 1 });
await png("public/icons/icon-512.png", 512, { rounded: true, scale: 1 });
await png("public/icons/icon-maskable-512.png", 512, {
  rounded: false,
  scale: 0.8,
});
await png("src/app/apple-icon.png", 180, { rounded: false, scale: 0.9 });
await writeFile(
  "src/app/icon.svg",
  svg(64, { rounded: true, scale: 1 }) + "\n",
);
console.log("✓ src/app/icon.svg");
